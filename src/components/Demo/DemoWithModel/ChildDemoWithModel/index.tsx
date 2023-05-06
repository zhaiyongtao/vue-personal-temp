import { computed, defineComponent, onMounted, ref } from 'vue';

// 使用defineComponent 定义组件,可以使用v-model
export default defineComponent({
  name: 'ChildDemoWithModel',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { expose, emit, slots }) {
    const handleClick = () => {
      value.value = 'mgy';
    };
    const value = computed({
      get() {
        console.log('props.modelValue ==> ', props.modelValue);
        return props.modelValue;
      },
      set(val) {
        emit('update:modelValue', val);
      }
    });
    const name = ref<string>('zyt1');
    expose({ name: name.value, handleClick });
    console.log('slots ==> ', slots);

    console.log('props.modelValue ==> ', props.modelValue);

    return () => {
      return (
        <>
          <div onClick={handleClick}>HomeArticleList</div>
          <div>{value.value}</div>
        </>
      );
    };
  }
});
