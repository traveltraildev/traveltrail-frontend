import { BASE_URL } from "../endpoints";

export const fetchPageContent = async (pageKey, getToken) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching content for ${pageKey}:`, error);
    throw error;
  }
};

export const updatePageContent = async (pageKey, updatedContent, getToken) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedContent),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating content for ${pageKey}:`, error);
    throw error;
  }
};