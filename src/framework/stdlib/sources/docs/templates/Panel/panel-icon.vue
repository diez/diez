<template>
  <svg viewBox="0 0 24 24">
    <rect style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x="5.25" y="5.25" width="13.5" height="13.5" rx="1.5" ry="1.5"></rect>
    <path style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" d="M23.25,20.25v1.5a1.5,1.5,0,0,1-1.5,1.5h-1.5"></path>
    <path style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" d="M20.25.75h1.5a1.5,1.5,0,0,1,1.5,1.5v1.5"></path>
    <path style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" d="M.75,3.75V2.25A1.5,1.5,0,0,1,2.25.75h1.5"></path>
    <path style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" d="M3.75,23.25H2.25a1.5,1.5,0,0,1-1.5-1.5v-1.5"></path>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="23.25" y1="7.5" x2="23.25" y2="9.75"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="23.25" y1="14.25" x2="23.25" y2="16.5"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="0.75" y1="7.5" x2="0.75" y2="9.75"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="0.75" y1="14.25" x2="0.75" y2="16.5"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="16.5" y1="23.25" x2="14.25" y2="23.25"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="9.75" y1="23.25" x2="7.5" y2="23.25"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="16.5" y1="0.75" x2="14.25" y2="0.75"></line>
    <line style="fill:none;stroke:#484262;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;" x1="9.75" y1="0.75" x2="7.5" y2="0.75"></line>
  </svg>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * Panel icon view.
 */
@Component
export default class PanelIcon extends Vue {}
</script>
