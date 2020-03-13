import SearchFormVue from '@/components/SearchForm.vue';
import {mount} from '@vue/test-utils';

const $route = {
  fullPath: '/?type=Color&name=MyColor',
  query: {
    type: 'Color',
    name: 'MyColor',
  },
};

describe('SearchForm', () => {
  const wrapper = mount(SearchFormVue, {
    mocks: {
      $route,
      $treeRoot: [],
      $router: {
        push: jest.fn(),
      },
    },
  });

  it('renders the elements necessary to search and filter', () => {
    expect(wrapper.contains('input[type=search]')).toBeTruthy();
    expect(wrapper.contains('select')).toBeTruthy();
    expect(wrapper.contains('option[value=""]')).toBeTruthy();
  });

  it('updates elements according to search query', () => {
    expect((wrapper.find('input[type=search]').element as HTMLInputElement).value).toBe($route.query.name);
  });

  it('cleans element values when route params are removed', () => {
    $route.fullPath = '/DesignLanguage/Something';
    expect((wrapper.find('input[type=search]').element as HTMLInputElement).value).toBe('');
    $route.fullPath = '/?type=Color&name=MyColor';
  });

  it('updates the search params when a search by text is performed', () => {
    const input = wrapper.find('input[type=search]');
    input.setValue('newSearch');
    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });
});
