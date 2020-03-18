import {DocsTargetSpec} from '@diez/targets';

declare module 'vue/types/vue' {
  interface Vue {
    $treeRoot: DocsTargetSpec[];
  }
}
