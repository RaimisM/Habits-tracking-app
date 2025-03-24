<template>
  <div class="mt-4">
    <button
      @click="isOpen = true"
      class="px-4 py-2 bg-green-500 text-white rounded transform hover:scale-105 transition-all duration-200"
    >
      + Add Habit
    </button>

    <!-- Modal Code -->
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg w-80">
        <h2 class="text-lg font-semibold">New Habit</h2>
        <input
          v-model="newHabit"
          class="border p-2 w-full rounded mt-2"
          placeholder="Enter habit name"
        />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="isOpen = false" class="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button @click="addHabit" class="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
