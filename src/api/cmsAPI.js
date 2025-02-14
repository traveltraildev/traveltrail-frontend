import cmsData from "../data/cmsData";

const simulatedAPI = {
  fetchPageContent: (pageKey) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const content = cmsData[pageKey];
        if (content) {
          console.log(`[Simulated API] Fetched content for page: ${pageKey}`, content);
          resolve({ data: content }); // Simulate successful API response with data
        } else {
          console.error(`[Simulated API] Page content not found for key: ${pageKey}`);
          reject({ message: "Page content not found." }); // Simulate API error
        }
      }, 500); // Simulate API latency of 500ms
    });
  },

  updatePageContent: (pageKey, updatedContent) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real API, you would update the data in a database here.
        // For simulation, we'll just update the cmsData object in memory.
        if (cmsData[pageKey]) {
          cmsData[pageKey] = updatedContent;
          console.log(`[Simulated API] Updated content for page: ${pageKey}`, cmsData[pageKey]);
          resolve({ message: "Content updated successfully." }); // Simulate successful API response
        } else {
          console.error(`[Simulated API] Page content not found for key: ${pageKey} (cannot update)`);
          reject({ message: "Page content not found (cannot update)." }); // Simulate API error
        }
      }, 750); // Simulate API latency of 750ms for updates (slightly longer)
    });
  },
};

export default simulatedAPI;
// --- END OF FILE src/api/cmsAPI.js ---