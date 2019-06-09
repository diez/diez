<template>
  <div class="nav-wrap">
    <div>
      <a href="/getting-started#why">Introduction</a>
      <a href="/getting-started#installation">Installation</a>
      <div>
        <a href="/getting-started#guides" class="category">Guides</a>
        <div>
          <div class="sub-category">General</div>
          <a class="sub-link soon" href="#">Hosting your Diez</a>
          <a class="sub-link soon" href="#">Creating Native Bindings</a>
          <a class="sub-link soon" href="#">Contributing a Prefab</a>
          <a class="sub-link soon" href="#">Contributing a Target</a>
          <a class="sub-link soon" href="#">Extending the CLI</a>
        </div>
        <div>
          <div class="sub-category">iOS</div>
          <a class="sub-link" href="/getting-started/swift">Swift</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">Objective-C</a>
        </div>
        <div>
          <div class="sub-category">Android</div>
          <a class="sub-link" href="/getting-started/kotlin">Kotlin</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">Java</a>
        </div>
        <div>
          <div class="sub-category">Web</div> 
          <a class="sub-link" href="/getting-started/javascript">JavaScript</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">CSS</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">Sass</a>
        </div>
        <div>
          <div class="sub-category">Design Tools</div>
          <a class="sub-link" href="/getting-started/sketch">Sketch</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">Figma</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">InVision DSM</a>
          <a class="sub-link soon" title="Guide coming soon" href="#">Abstract</a>
        </div>
      </div>            
    </div>           
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';

@Component
export default class NavBar extends Vue {
  private isOpen = true;
  scrollToSelector (selector: string) {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
      });
    }
  }
  toggleMenu () {
    this.isOpen = !this.isOpen;
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/_utils.scss';
  @import '@/assets/styles/_shared.scss';

  .nav-wrap {
    position: fixed;
    height: 100%;
    top: 0;
    padding: 153px 0;
    overflow-y: auto;
    overflow-x: hidden;
    a {
      display: block;
      margin-bottom: $spacingLG;
    }
    @include tablet {
      display: none;
    }
  }
  .category {
    margin-bottom: 0 !important;
  }
  .sub-category {
    color: $black;
    font-size: $smallText;
    font-weight: 700;
    margin: $spacingSM 0 $spacingSM $spacingSM;
  }
  .sub-link {
    color: $mauve;
    font-size: $smallText;
    margin-left: $spacingLG;
    margin-bottom: $spacingSM !important;
    &.soon {
      text-decoration: line-through;
      color: $gray700;
      font-style: italic;
      cursor: not-allowed;
    }
  }
</style>
