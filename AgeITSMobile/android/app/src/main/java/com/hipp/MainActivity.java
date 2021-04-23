package com.hipp;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

import android.os.Bundle; 


import android.content.Intent;


public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {       
        
        SplashScreen.show(this,false);  // here

        
        //RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.CENTER_INSIDE);
        
        super.onCreate(savedInstanceState);
        
        //addShortcut();
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Hipp";
    }
/*
    private void addShortcut() {
        final Intent shortcutIntent = new Intent(this, MainActivity.class);
    
        final Intent intent = new Intent();
        intent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        // Sets the custom shortcut's title
        intent.putExtra(Intent.EXTRA_SHORTCUT_NAME, getString(R.string.app_name));
        // Set the custom shortcut icon
        intent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Intent.ShortcutIconResource.fromContext(this, R.mipmap.ic_launcher));
        // add the shortcut
        intent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");
        sendBroadcast(intent);
    }
    */
}
