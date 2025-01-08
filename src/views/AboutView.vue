<template>
  <main>
    <div class="flex flex-col items-center pt-8">
      <div class="prose dark:prose-invert prose-zinc">
        <h2>Why did I make this?</h2>
        <p>
          This was developed as part of a homework received during the
          <code>Advanced Data Structures</code> course that I'm currently taking. The goal was to
          implement at least one of the data structures that we've learned in class into our own
          project.
        </p>
        <p>
          I took inspiration from
          <a href="https://www.cs.usfca.edu/~galles/visualization/BTree.html" target="_blank"
            >this website</a
          >, developed by Associate Professor David Galles from the University of San Francisco. My
          goal was to create a tool with similar functionality, but with a more modern look and
          feel.
        </p>
        <h2>How did I make this? (Credits)</h2>
        <p>
          Since I decided to make this as a web app, I used a framework I was already somewhat
          familiar with, namely <a href="https://vuejs.org" target="_blank">Vue.js</a>. I also used
          <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>, my preferred way of
          writing CSS.
        </p>
        <p>
          For the UI components I used
          <a href="https://primevue.org/" target="_blank">PrimeVue</a>, a Vue.js component library.
          Especially useful was the
          <a href="https://primevue.org/organizationchart/" target="_blank">OrganizationChart</a>
          component, which I used to display the trees.
        </p>
        <p>Finally, all of the algorithms and data structures were implemented by me.</p>
      </div>
    </div>
  </main>
</template>
