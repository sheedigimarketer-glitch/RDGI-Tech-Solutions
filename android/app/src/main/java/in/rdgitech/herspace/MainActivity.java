package in.rdgitech.herspace;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().clearCache(true);
        }
    }

    @Override
    public void onBackPressed() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.evaluateJavascript(
                "(function() { " +
                "  if (window.herSpaceApp && typeof window.herSpaceApp.handleHardwareBack === 'function') { " +
                "    return window.herSpaceApp.handleHardwareBack(); " +
                "  } " +
                "  return false; " +
                "})()",
                result -> {
                    if ("false".equals(result) || result == null) {
                        runOnUiThread(MainActivity.super::onBackPressed);
                    }
                }
            );
        } else {
            super.onBackPressed();
        }
    }
}
