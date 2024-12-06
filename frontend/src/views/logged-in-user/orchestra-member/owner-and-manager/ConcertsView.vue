<template>
  <div class="concerts-view">
    <div class="concerts-view__title">
      <h1>Concerts</h1>
    </div>

    <div class="concerts-view__content">
      <pre>
        <div>Create a concerts (seperate component)</div>
        
        <div>Display all concerts -> go to details (seperate component)</div>
        
        <div>concert details component:
          - edit button on the top right -> go to edit concert (seperate component)
          - delete button on the top right
          - concert details
          - list of all members with their availability (seperate component)
        </div>

        <div>edit concert component:
          - form
          - save button
        </div>
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style setup lang="scss">
.concerts-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 50px;
    // align-items: center;
    width: 100%;
  }
}
</style>
