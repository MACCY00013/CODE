plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android { namespace="com.maccycreations.careeros"; compileSdk=35
    defaultConfig { applicationId="com.maccycreations.careeros"; minSdk=24; targetSdk=35; versionCode=15; versionName="10.5.0" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation("androidx.compose.ui:ui:1.7.8")
    implementation("androidx.compose.ui:ui-tooling-preview:1.7.8")
    implementation("androidx.compose.material3:material3:1.3.1")
}
