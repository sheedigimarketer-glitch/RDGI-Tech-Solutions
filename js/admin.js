/**
 * HerSpace Premium 2.0 - Administration & Professional Credential Verification
 */

(function() {
  'use strict';

  const store = window.herSpaceStore;

  const initialApplications = [
    {
      id: 'app-01',
      name: 'Dr. Gayathri R.',
      role: 'counsellor',
      qualification: 'M.Phil Clinical Psychology, NIMHANS',
      rciNumber: 'CRR-A78942',
      experienceYears: 14,
      specialties: ['Trauma & Depression', 'Anxiety'],
      status: 'pending',
      bio: 'Clinical psychologist with extensive experience in evidence-based cognitive trauma recovery.',
      submittedAt: '2026-10-26T14:30:00Z'
    },
    {
      id: 'app-02',
      name: 'Kavitha S.',
      role: 'listener',
      qualification: 'Certified Peer Support Specialist · Empathy First Aid',
      rciNumber: null,
      experienceYears: 4,
      specialties: ['Postpartum & Family Transitions'],
      status: 'pending',
      bio: 'Empathetic listener focusing on maternal mental health and navigating new parenthood.',
      submittedAt: '2026-10-27T09:15:00Z'
    }
  ];

  window.herSpaceAdmin = {
    applications: initialApplications,

    getApplications() {
      return this.applications;
    },

    submitApplication({ name, email, phone, role, qualification, rciNumber, experienceYears, specialties, bio }) {
      let appId = 'app-' + Date.now().toString(36);
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const bytes = new Uint8Array(6);
        window.crypto.getRandomValues(bytes);
        appId = 'app-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
      }
      const newApp = {
        id: appId,
        name,
        email,
        phone,
        role,
        qualification,
        rciNumber: role === 'counsellor' ? rciNumber : null,
        experienceYears: parseInt(experienceYears, 10) || 0,
        specialties: specialties || ['Emotional Support'],
        bio: bio || 'Professional applicant',
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      this.applications.unshift(newApp);
      store.toast(`Application for ${name} submitted successfully. Under administrator review.`, 'success');
      store.notify();
      return newApp;
    },

    approveApplication(appId) {
      const app = this.applications.find(a => a.id === appId);
      if (app) {
        app.status = 'approved';

        // Add newly approved professional directly to the active directory
        const newExpert = {
          id: 'exp-' + app.id,
          name: app.name,
          role: app.role,
          qualification: app.qualification + (app.rciNumber ? ` · RCI ${app.rciNumber}` : ''),
          experienceYears: app.experienceYears,
          pricePaise: app.role === 'listener' ? 39900 : 99900,
          priceDisplay: app.role === 'listener' ? 399 : 999,
          durationMinutes: 60,
          avatar: app.role === 'listener' ? 'assets/images/avatar-priya.png' : 'assets/images/avatar-anita.png',
          specialties: app.specialties,
          languages: ['English', 'Tamil'],
          modes: ['Voice Call', 'Video Call', 'Private Chat'],
          rating: 5.0,
          reviewsCount: 1,
          bio: app.bio,
          verified: true
        };

        store.state.experts.unshift(newExpert);
        store.toast(`Application for ${app.name} approved! Added to verified expert directory.`, 'success');
        store.notify();
      }
    },

    rejectApplication(appId, reason) {
      const app = this.applications.find(a => a.id === appId);
      if (app) {
        app.status = 'rejected';
        app.rejectionReason = reason;
        store.toast(`Application for ${app.name} rejected.`, 'warning');
        store.notify();
      }
    },

    // Process Counsellor No-Show with 100% Refund
    reportProviderNoShow(appointmentId) {
      const apt = store.state.appointments.find(a => a.id === appointmentId);
      if (!apt) throw new Error('Appointment not found.');

      store.updateAppointment(appointmentId, {
        status: 'refunded_due_to_provider_absence',
        refundAmount: apt.priceDisplay,
        refundProcessedAt: new Date().toISOString()
      });

      store.toast(`Refund of ₹${apt.priceDisplay} processed due to provider absence.`, 'success');
    }
  };
})();
