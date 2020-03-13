import DynamicHeadingVue from '@/components/DynamicHeading.vue';
import {shallowMount} from '@vue/test-utils';

describe('DynamicHeading', () => {
  const h1 = shallowMount(DynamicHeadingVue, {
    propsData: {
      level: 1,
    },
    slots:{
      default: 'heading one',
    },
  });

  const h4 = shallowMount(DynamicHeadingVue, {
    propsData: {
      level: 4,
    },
    slots:{
      default: 'heading four',
    },
  });

  it('renders an HTML heading that corresponds to the level prop', () => {
    expect(h1.is('h1')).toBeTruthy();
    expect(h4.is('h4')).toBeTruthy();
  });

  it('renders the correct content', () => {
    expect(h1.text()).toBe('heading one');
    expect(h4.text()).toBe('heading four');
  });
});
