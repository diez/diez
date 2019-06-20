<template>
  <div>
    <NavBar></NavBar>
    <div class="page shared">
      <section class="section-narrow">
        <h2>Anonymous aggregate analytics</h2>
        <p>Diez collects diagnostic and usage data each time you use the CLI using an anonymous, randomly generated ID. We use these data to help improve our services.</p>
        <p>The data sent to our server is completely anonymous and in no way can be traced back to you as an individual nor cross-linked or enriched.  (We do not store IP addresses or any other personally identifiable information alongside the randomly generated unique ID.)</p>
        <div class="block">
          <h3>How it's used</h3>
          <p>We use this data to understand in aggregate:</p>
          <ul>
            <li>How long an average user keeps using Diez after starting.</li>
            <li>How frequently an average user uses the CLI.</li>
            <li>Diagnostic information (OS, Node version, etc.) for users who experience crashes or instability while using Diez.</li>
          </ul>
          <h3>How it works</h3>
          <p>The randomly generated unique ID that Diez sends to our server will be stored inside <code class="inline">~/.diez/registry.json</code>, and you can find all the related source code on GitHub:</p>
          <ul>
            <li><a href="https://github.com/diez/diez/blob/master/packages/storage/src/analytics.ts">How and when we ping our servers</a>.</li>
            <li><a href="https://github.com/diez/diez/tree/master/services/analytics">The source code for analytics.diez.org</a>.</li>
          </ul>
        </div>
        <div class="block">
          <h3>Disable anonymous tracking</h3>
          <p>We believe that privacy is a fundamental human right; so we provide the ability to disable your participation in these analytics before they begin.</p>
          <p>If you would prefer not to have your anonymous usage data tracked, at anytime run the following command.</p>
          <div class="code-block">
            <pre><code>diez analytics off</code></pre>
          </div>
          <p class="note">Or to re-enable: <code class="inline">diez analytics on</code></p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import NavBar from '@theme/components/NavBar.vue';

export default {
  components: {NavBar}
};
</script>

<style lang="scss" scoped>
  @import '@theme/styles/_utils.scss';
  section {
    margin-top: $sizingXS !important;
    @include tablet {
      margin-top: 0 !important;
    }
  }
  h2 {
    margin-top: 0;
    margin-bottom: 0;
  }
  .block {
    margin-bottom: $spacing3XL;
  }

  .nav-wrap {
    position: fixed;
    top: 200;
    a {
      display: block;
      margin-bottom: $spacingLG;
    }
    @include tablet {
      display: none;
    }
  }
</style>
