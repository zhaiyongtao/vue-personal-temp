import { defineComponent, ref } from 'vue';

import ChildDemoWithModel from '@/components/Demo/DemoWithModel/ChildDemoWithModel';

export default defineComponent({
  name: 'Home',
  emits: ['changeName'],
  setup(props, { expose, emit, slots }) {
    const name = ref<string>('zyt');
    return () => {
      return (
        <>
          <ChildDemoWithModel
            v-model={name.value}
            onUpdate:modelValue={(val) => {
              console.log('name.value=>', name.value, val);
            }}></ChildDemoWithModel>

          <div>ModelDemoParent :{name.value}</div>
        </>
      );
    };
  }
});
