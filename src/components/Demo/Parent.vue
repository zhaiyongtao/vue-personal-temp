<template>
  <!--  <RouterView />-->
  <VueTemplateTest @change-name="handleChangeName">
    <template #default>
      <div>测试default</div>
    </template>
    <template #content>
      <div>测试content</div>
    </template>
    <template #footer="{ props }">
      <div>作用域插槽{{ props }}</div>
    </template>
  </VueTemplateTest>
</template>

<script setup lang="ts">
// import { RouterView } from 'vue-router';
import VueTemplateTest from '@/components/Demo/VueTemplateTest';

const handleChangeName = (val: string) => {
  console.log('val ==> ', val);
};
</script>

<style scoped lang="scss"></style>
