from playwright.sync_api import sync_playwright, expect
import sys

def run_verification(playwright):
    # If a URL is passed as an argument, use it. Otherwise, default to localhost:3000.
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

    browser = playwright.chromium.launch(headless=True)
    # Set a mobile viewport
    context = browser.new_context(viewport={'width': 375, 'height': 812})
    page = context.new_page()

    try:
        # 1. Navigate to the Trips page
        trips_url = f"{base_url}/trips"
        print(f"Navigating to {trips_url}...")
        page.goto(trips_url, timeout=60000)

        # 2. Wait for the page to be ready
        # Wait for the main heading to ensure the page has loaded.
        expect(page.get_by_role("heading", name="Discover Your Dream Travel Packages")).to_be_visible(timeout=20000)
        # Wait for at least one card to be rendered, indicating the data has been fetched.
        expect(page.get_by_text("View Details").first).to_be_visible(timeout=20000)
        print("Trips page loaded successfully.")

        # 3. Find and click the filter button
        # The filter button is an IconButton containing a Tune icon, and it's visible on mobile.
        # It's inside the same Paper component as the search bar.
        search_input = page.get_by_placeholder("Search by trip name or destination...")
        # The Paper component has a stable MUI class name.
        paper_container = search_input.locator('xpath=./ancestor::div[contains(@class, "MuiPaper-root")]')
        filter_button = paper_container.get_by_role('button')

        print("Clicking the filter button to open the sidebar...")
        filter_button.click()

        # 4. Wait for the filter sidebar (Drawer) to appear
        # The Drawer is a dialog, and we can wait for its content to be visible.
        print("Waiting for the filter sidebar to open...")
        expect(page.get_by_text("Sort By")).to_be_visible(timeout=10000)
        print("Filter sidebar is open.")

        # 5. Take a screenshot for visual verification
        screenshot_path = "jules-scratch/verification/verification.png"
        print(f"Taking screenshot and saving to {screenshot_path}")
        page.screenshot(path=screenshot_path)
        print("Screenshot captured successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}", file=sys.stderr)
        # Take a screenshot for debugging purposes if something goes wrong.
        page.screenshot(path="jules-scratch/verification/error.png")
        # Exit with a non-zero code to indicate failure
        sys.exit(1)
    finally:
        browser.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        run_verification(p)