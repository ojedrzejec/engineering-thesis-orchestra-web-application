<template>
  <div class="pieces-of-music-view">
    <div class="pieces-of-music-view__title">
      <h1>Pieces of Music</h1>
    </div>

    <pre>
      PLAYER (for their group)
      <div>
        See all pieces of music (title, composer, pdf files, group):
        - button to download pdf files
      </div>


      
      OWNER
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
</template>

<script setup lang="ts"></script>

<style setup lang="scss"></style>
