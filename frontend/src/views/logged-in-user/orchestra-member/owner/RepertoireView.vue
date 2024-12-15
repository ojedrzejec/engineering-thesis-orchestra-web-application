<template>
  <div class="repertoire-view">
    <div class="repertoire-view__title">
      <h1>Repertoire</h1>
    </div>

    <div class="repertoire-view__content">
      <pre>
        OWNER (create new pieces of music, add new files)
        <div>
          See all pieces of music (title, composer, pdf files, group):
          - button to add a new file "Add new file" -> go to Add new file (form)
              ..........................
              Add new file (form)
              - pdf file
              - orchestra group (select)
              = button ("Add")
              ..........................
        </div>
        <div>
          Create Orchestra Group (form):
          - name
          = button ("Create new group")
        </div>
        <div>
          Create new Piece Of Music (form):
          - title
          - composer
          = button ("Create new piece of music" - HERE WITHOUT PDF FILES)
        </div>
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style setup lang="scss">
.repertoire-view {
  margin-bottom: 50px;

  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 50px;
    width: 100%;
  }
}
</style>
