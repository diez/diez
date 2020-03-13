import {DocsTargetSpec} from '@diez/docs';

declare module 'vue/types/vue' {
  interface Vue {
    $treeRoot: DocsTargetSpec[];
  }
}
