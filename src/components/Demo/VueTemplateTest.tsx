import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'VueTemplateTest',
  props: {
    realName: {
      type: String,
      default: '',
      required: false
    }
  },
  emits: ['changeName'],
  setup(props, { expose, emit, slots }) {
    const handleClick = () => {
      emit('changeName', '张三');
    };
    const name = ref<string>('zyt');
    expose({ name: name.value, handleClick });
    console.log('slots ==> ', slots);
    return {
      handleClick,
      name,
      slots
    };
  },
  render() {
    return (
      <div>
        {this.slots.default ? this.slots.default() : <div>测试</div>}
        {this.slots.content ? this.slots.content() : <div>测试</div>}
        {this.slots.footer ? this.slots.footer({ props: '底部1' }) : <div>测试</div>}
        <div>{this.name}</div>
      </div>
    );
  }
});
