/**
 * HerSpace Premium 2.0 - Appointment Scheduling & Rescheduling Engine
 */

(function() {
  'use strict';

  const store = window.herSpaceStore;
  const config = window.HERSPACE_CONFIG;

  window.herSpaceBooking = {
    // ---- Membership gating -------------------------------------------------------------------
    // A member may book new paid sessions while the free trial is running or a paid period is active.
    entitlementStatus(entitlementOverride) {
      const ent = entitlementOverride || store.state.entitlement;
      if (!ent) return 'none';
      const now = Date.now();
      if (ent.paidThrough && new Date(ent.paidThrough).getTime() > now) return 'paid';
      if (ent.trialEndsAt && new Date(ent.trialEndsAt).getTime() > now) return 'trial';
      return 'expired';
    },

    canBookNewSession() {
      const s = this.entitlementStatus();
      return !!store.state.user && (s === 'trial' || s === 'paid');
    },

    // ---- Per-category availability ----------------------------------------------------------
    // Each category (and each provider) exposes its own working days and slots.
    availabilityFor(provider) {
      const role = provider && provider.role;
      const overrides = {
        'listener-priya': { days: [1, 2, 3, 4, 5, 6], slots: ['10:00 AM - 11:00 AM', '04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM'] },
        'listener-meera': { days: [0, 1, 2, 3, 4, 5, 6], slots: ['11:30 AM - 12:30 PM', '06:00 PM - 07:00 PM', '08:00 PM - 09:00 PM'] },
        'counsellor-anita': { days: [1, 2, 3, 4, 5], slots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'] },
        'counsellor-neha': { days: [1, 3, 5, 6], slots: ['11:30 AM - 12:30 PM', '02:00 PM - 03:00 PM'] }
      };
      if (provider && overrides[provider.id]) return overrides[provider.id];
      if (role === 'singer') return { days: [0, 1, 2, 3, 4, 5, 6], slots: ['06:00 PM - 06:30 PM', '07:00 PM - 07:30 PM', '08:00 PM - 08:30 PM'] };
      return { days: [1, 2, 3, 4, 5, 6], slots: this.getTimeSlots().map(s => s.time) };
    },

    availabilitySummary(provider) {
      const a = this.availabilityFor(provider);
      const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return { days: a.days.map(d => names[d]).join(' · '), slots: a.slots };
    },

    // Generate available slot dates for the next 7 days (optionally limited to a provider's working days)
    getAvailableDates(provider) {
      const dates = [];
      const today = new Date();
      const allowed = provider ? this.availabilityFor(provider).days : null;
      for (let i = 1; i <= 14 && dates.length < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        if (allowed && allowed.indexOf(d.getDay()) === -1) continue;
        dates.push({
          dateStr: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString('en-US', { month: 'short' })
        });
      }
      return dates;
    },

    // Daily time slots
    getTimeSlots(dateStr) {
      return [
        { time: '10:00 AM - 11:00 AM', available: true },
        { time: '11:30 AM - 12:30 PM', available: true },
        { time: '02:00 PM - 03:00 PM', available: true },
        { time: '04:00 PM - 05:00 PM', available: true },
        { time: '06:00 PM - 07:00 PM', available: true },
        { time: '08:00 PM - 09:00 PM', available: true }
      ];
    },

    getAvailableTimeSlots(expertId, dateStr) {
      const provider = (store.state.experts.find(e => e.id === expertId)) ||
        ((window.HERSPACE_LIVE_SINGERS || []).find(s => s.id === expertId)) || null;
      const slots = provider ? this.availabilityFor(provider).slots : this.getTimeSlots(dateStr).map(s => s.time);
      return slots.map(time => ({
        time,
        available: !store.state.appointments.some(a => a.expertId === expertId && a.date === dateStr && a.time === time && a.status === 'scheduled')
      }));
    },

    // Check if user has an active, unexpired complimentary welcome session
    canUseComplimentarySession() {
      const { user, entitlement } = store.state;
      if (!user || !entitlement) return false;
      if (entitlement.welcomeCallStatus !== 'available') return false;

      const expiry = new Date(entitlement.welcomeCallExpiresAt).getTime();
      return Date.now() < expiry;
    },

    isWelcomeCallEligible(entitlementOverride) {
      const ent = entitlementOverride || store.state.entitlement;
      if (!ent) return false;
      if (ent.welcomeCallStatus !== 'available') return false;
      const expiry = new Date(ent.welcomeCallExpiresAt).getTime();
      return Date.now() < expiry;
    },

    processProviderNoShowRefund(appointmentId) {
      if (window.herSpaceAdmin && typeof window.herSpaceAdmin.reportProviderNoShow === 'function') {
        return window.herSpaceAdmin.reportProviderNoShow(appointmentId);
      }
    },

    // Book a Session
    confirmBooking({ expert, dateStr, timeSlot, mode, sessionType }) {
      const { user, entitlement } = store.state;
      if (!user) throw new Error('Please sign in or create an account to book a session.');
      if (!this.canBookNewSession()) {
        const err = new Error('Your free trial has ended. Booking new sessions needs an active HerSpace membership.');
        err.code = 'MEMBERSHIP_REQUIRED';
        throw err;
      }

      let pricePaise = 0;
      let durationMinutes = 60;
      let isComplimentary = false;
      let feePending = false;

      if (sessionType === 'welcome_listener') {
        if (!this.canUseComplimentarySession()) {
          throw new Error('Your complimentary welcome session is expired or already used.');
        }
        pricePaise = 0;
        durationMinutes = 30;
        isComplimentary = true;
      } else if (expert.role === 'singer') {
        // Live Melodies fee is Pending Client Approval: never invent a price.
        pricePaise = 0;
        durationMinutes = 20;
        feePending = true;
      } else if (expert.role === 'listener') {
        pricePaise = config.pricing.trainedListenerPerSession * 100; // ₹399
      } else {
        pricePaise = config.pricing.professionalCounsellorPerSession * 100; // ₹999
      }

      // Check slot conflict for this provider
      const existing = store.state.appointments.find(a => a.expertId === expert.id && a.date === dateStr && a.time === timeSlot && a.status === 'scheduled');
      if (existing) {
        throw new Error('This time slot is already reserved. Please select another slot.');
      }

      const appointmentId = 'apt-' + Math.random().toString(36).substring(2, 9);
      const appointmentDate = new Date(`${dateStr} ${timeSlot.split(' - ')[0]}`);
      const rescheduleThreshold = new Date(appointmentDate.getTime() - config.appointments.rescheduleCutoffHours * 3600000);

      const newAppointment = {
        id: appointmentId,
        expertId: expert.id,
        expertName: expert.name,
        expertNameTa: expert.nameTa || '',
        expertRole: expert.role,
        avatar: expert.avatar,
        date: dateStr,
        time: timeSlot,
        mode: mode || 'Voice Call',
        status: 'scheduled',
        sessionType,
        isComplimentary,
        feePending,
        pricePaise,
        priceDisplay: pricePaise / 100,
        durationMinutes,
        rescheduleAllowedUntil: rescheduleThreshold.toISOString(),
        createdAt: new Date().toISOString()
      };

      store.addAppointment(newAppointment);

      // If user redeemed the complimentary voucher, mark it reserved/completed
      if (isComplimentary) {
        store.setEntitlement({
          ...entitlement,
          welcomeCallStatus: 'reserved'
        });
      }

      store.toast(`✅ Session booked with ${expert.name} on ${dateStr} at ${timeSlot}!`, 'success');
      return newAppointment;
    },

    // Reschedule appointment (enforcing 4-hour rule)
    rescheduleAppointment(appointmentId, newDateStr, newTimeSlot) {
      const apt = store.state.appointments.find(a => a.id === appointmentId);
      if (!apt) throw new Error('Appointment not found.');

      if (apt.status !== 'scheduled') {
        throw new Error('Only active scheduled appointments can be rescheduled.');
      }

      const now = Date.now();
      const cutoff = new Date(apt.rescheduleAllowedUntil).getTime();

      if (now > cutoff) {
        throw new Error(`Rescheduling is locked within ${config.appointments.rescheduleCutoffHours} hours of your session. Please contact support.`);
      }

      const newApptDate = new Date(`${newDateStr} ${newTimeSlot.split(' - ')[0]}`);
      const newThreshold = new Date(newApptDate.getTime() - config.appointments.rescheduleCutoffHours * 3600000);

      store.updateAppointment(appointmentId, {
        date: newDateStr,
        time: newTimeSlot,
        rescheduleAllowedUntil: newThreshold.toISOString(),
        rescheduledAt: new Date().toISOString()
      });

      store.toast(`🗓️ Session successfully rescheduled to ${newDateStr} at ${newTimeSlot}.`, 'success');
    }
  };
})();
