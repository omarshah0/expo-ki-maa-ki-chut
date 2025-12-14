import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" drawable="custom_android_drawable" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="packages">
        <Icon sf="shippingbox.fill" drawable="custom_android_drawable" />
        <Label>Packages</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="login">
        <Icon sf="person.circle.fill" drawable="custom_android_drawable" />
        <Label>Login</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf="paperplane.fill" drawable="custom_android_drawable" />
        <Label>Explore</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
