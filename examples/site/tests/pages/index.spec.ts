import index from '@/pages/index.vue';
import {shallowMount} from '@vue/test-utils';

describe('index.vue', () => {
  it('is happening', () => {
    const wrapper = shallowMount(index);
    expect(wrapper.text()).toMatch('Diez');
  });
});
