import { Plugin, WorkspaceLeaf, ItemView, ViewState } from "obsidian";

const SETTINGS_VIEW_TYPE = "app-settings-view";

export default class SettingsInTab extends Plugin {
  async onload() {
    // 1. Register our custom view type
    this.registerView(
      SETTINGS_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new AppSettingsView(leaf),
    );

    // 2. Add (or override) the "Open Settings" command
    this.addCommand({
      id: "open-settings-in-tab",
      name: "Open Settings in Tab",
      callback: () => this.openSettingsInTab(),
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "," }],
    });

    // Note: We can't easily override the default settings command
    // Users can use Ctrl+, or the command palette to access the tabbed settings

    this.addRibbonIcon("settings", "Open Settings in Tab", () =>
      this.openSettingsInTab(),
    );
  }

  onunload() {
    // Clean up: remove our view if user disables plugin
    this.app.workspace
      .getLeavesOfType(SETTINGS_VIEW_TYPE)
      .forEach((leaf) => leaf.detach());
  }

  async openSettingsInTab() {
    const existingLeaf =
      this.app.workspace.getLeavesOfType(SETTINGS_VIEW_TYPE)[0];
    if (existingLeaf) {
      this.app.workspace.setActiveLeaf(existingLeaf);
      return;
    }
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({
      type: SETTINGS_VIEW_TYPE,
      active: true,
    } as ViewState);
    this.app.workspace.setActiveLeaf(leaf);
  }
}

class AppSettingsView extends ItemView {
  private activeTabId: string = "";
  private navigationTabsContainer: HTMLElement;
  private contentContainer: HTMLElement;
  private settingTabs: Array<any> = [];
  private corePluginTabs: Array<any> = [];
  private communityPluginTabs: Array<any> = [];

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return SETTINGS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Settings";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("settings-view-content");

    // Grab Obsidian's registry of SettingTabs
    const settingRegistry: any = (this.app as any).setting;

    this.settingTabs = settingRegistry.settingTabs as Array<any>;
    this.corePluginTabs = (settingRegistry.pluginTabs as Array<any>)
      .filter((tab) => !tab.plugin.manifest)
      .sort((a, b) => a.name.localeCompare(b.name));
    this.communityPluginTabs = (settingRegistry.pluginTabs as Array<any>)
      .filter((tab) => tab.plugin.manifest)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Create the main container with sidebar layout (like native settings)
    const mainContainer = container.createDiv("vertical-tabs-container");
    this.navigationTabsContainer = mainContainer.createDiv(
      "vertical-tab-header",
    );
    this.contentContainer = mainContainer.createDiv(
      "vertical-tab-content-container",
    );

    // Render sidebar navigation
    this.renderNavigationTabs();

    // Show first tab by default
    if (this.settingTabs.length > 0) {
      this.showTab(this.settingTabs[0].id || this.settingTabs[0].name);
    }
  }

  private createNavigationTabItem(
    tab: any,
    groupContainer: HTMLElement,
  ): HTMLElement {
    const tabId = tab.id || tab.name;
    const tabItem = groupContainer.createDiv("vertical-tab-nav-item");
    tabItem.setText(tab.name);
    tabItem.setAttribute("data-tab-id", tabId);

    // Add click handler
    tabItem.addEventListener("click", () => {
      this.showTab(tabId);
    });

    // Mark first tab as active
    if (!this.activeTabId && this.settingTabs.indexOf(tab) === 0) {
      tabItem.addClass("active");
      this.activeTabId = tab.id || tab.name;
    }

    return tabItem;
  }

  private createNavigationTabItemGroup(
    tabs: any[],
    title: string,
  ): HTMLElement {
    const groupContainer = this.navigationTabsContainer.createEl("div", {
      cls: "vertical-tab-header-group",
    });
    groupContainer.createEl("div", {
      text: title,
      cls: "vertical-tab-header-group-title",
    });
    tabs.forEach((tab) => this.createNavigationTabItem(tab, groupContainer));
    return groupContainer;
  }

  private renderNavigationTabs(): void {
    this.navigationTabsContainer.empty();

    this.createNavigationTabItemGroup(this.settingTabs, "Options");
    this.createNavigationTabItemGroup(this.corePluginTabs, "Core Plugins");
    this.createNavigationTabItemGroup(
      this.communityPluginTabs,
      "Community Plugins",
    );
  }

  private showTab(tabId: string): void {
    // Update active sidebar item
    this.navigationTabsContainer
      .querySelectorAll(".vertical-tab-nav-item")
      .forEach((item) => {
        item.removeClass("is-active");
        if (item.getAttribute("data-tab-id") === tabId) {
          item.addClass("is-active");
        }
      });

    // Find the corresponding tab
    const selectedTab = [
      ...this.settingTabs,
      ...this.corePluginTabs,
      ...this.communityPluginTabs,
    ].find((tab) => (tab.id || tab.name) === tabId);

    if (!selectedTab) return;

    // Clear content and render selected tab
    this.contentContainer.empty();

    // Create a container for the tab content
    const contentArea = this.contentContainer.createDiv("vertical-tab-content");

    // Hook the tab's container and call its display()
    selectedTab.containerEl = contentArea;

    console.log({ selectedTab });

    try {
      selectedTab.display();
    } catch (error) {
      console.error(
        `Error displaying settings tab "${selectedTab.name}":`,
        error,
      );
      contentArea.createEl("p", {
        text: `Error loading settings for ${selectedTab.name}`,
        cls: "settings-error",
      });
    }

    this.activeTabId = tabId;
  }

  async onClose(): Promise<void> {
    // Clean up any event listeners or resources
  }
}
