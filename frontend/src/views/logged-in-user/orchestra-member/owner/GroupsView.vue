<template>
  <div class="groups-view">
    <div class="groups-view__title">
      <h1>Groups</h1>
    </div>

    <div class="groups-view__content">
      <pre>
      <div>
        See all Orchestra Groups:
        -> delete group
        -> see all assigned members
      </div>
      <div>
        Create Orchestra Group (form):
        - name
        = button (Create new group)
      </div>
      <div>
        Add Orchesstra Member to the Group (form):
        - orchestra member email (select)
        - orchestra group (select)
        = button (Assign Member to the Group)
      </div>
    </pre>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style setup lang="scss">
.groups-view {
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
