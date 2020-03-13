import BreadcrumbVue from '@/components/Breadcrumb.vue';
import {mount, RouterLinkStub} from '@vue/test-utils';

describe('Breadcrumb', () => {
  const wrapper = mount(BreadcrumbVue, {
    stubs: {
      RouterLink: RouterLinkStub,
    },
    mocks: {
      $route: {
        fullPath: '/DesignLanguage/Palette/red'
      },
    },
  });

  it('shows the correct breadcrumb structure', () => {
    const crumbs = wrapper.findAll('li');
    expect(crumbs.at(0).text()).toContain('DesignLanguage');
    expect(crumbs.at(1).text()).toContain('Palette');
    expect(crumbs.at(2).text()).toContain('red');
  });

  it('has correct links for every crumb', () => {
    const crumbs = wrapper.findAll(RouterLinkStub);
    expect(crumbs.at(0).props().to).toBe('/DesignLanguage');
    expect(crumbs.at(1).props().to).toBe('/DesignLanguage/Palette');
    expect(crumbs.at(2).props().to).toBe('/DesignLanguage/Palette/red');
  });
});
