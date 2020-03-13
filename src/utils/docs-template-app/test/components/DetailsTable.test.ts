import DetailsTableVue from '@/components/DetailsTable.vue';
import {shallowMount} from '@vue/test-utils';

describe('DetailsTable', () => {
  const wrapper = shallowMount(DetailsTableVue, {
    propsData: {
      details: {
        Name: 'Heading One',
        'Font Family': 'Helvetica',
      },
    },
  });

  it('shows the correct DetailsTable structure', () => {
    const details = wrapper.findAll('td');
    expect(details.at(0).text()).toContain('Name');
    expect(details.at(1).text()).toContain('Heading One');

    expect(details.at(2).text()).toContain('Font Family');
    expect(details.at(3).text()).toContain('Helvetica');
  });
});
