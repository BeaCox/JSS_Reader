import React, { useState } from "react";
import { Card, Radio} from "antd";

function Settings() {
  const [general, setGeneral] = useState({
    startPage: "all",
    defaultSort: "latest",
    defaultPresentation: "cards",
    autoRefreshFrequency: "10min",
    markAsReadOnScroll: "yes",
    presentArticlesOnNewTabPage: "yes",
  });

  const [appearance, setAppearance] = useState({
    fontSize: "medium",
    fontFamily: "default",
    theme: "light",
    displayDensity: "default",
  });


  return (
    <div style={{ padding: "2rem 3rem" }}>
      <Card title="General" style={{ marginBottom: "3rem",borderRadius:'20px' }}>
        <div style={{ marginBottom: 20, fontSize:18 }}>
          Start Page:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setGeneral({ ...general, startPage: e.target.value })}
            value={general.startPage}
          >
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="star">Star</Radio.Button>
            <Radio.Button value="unread">Unread</Radio.Button>
            <Radio.Button value="explore">Explore</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Default Sort:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setGeneral({ ...general, defaultSort: e.target.value })}
            value={general.defaultSort}
          >
            <Radio.Button value="latest">Latest</Radio.Button>
            <Radio.Button value="oldest">Oldest</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Default Presentation:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setGeneral({ ...general, defaultPresentation: e.target.value })}
            value={general.defaultPresentation}
          >
            <Radio.Button value="cards">Cards View</Radio.Button>
            <Radio.Button value="magazine">Magazine View</Radio.Button>
            <Radio.Button value="titles">Titles-Only View</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Auto Refresh Frequency:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setGeneral({ ...general, autoRefreshFrequency: e.target.value })}
            value={general.autoRefreshFrequency}
          >
            <Radio.Button value="10min">10 min</Radio.Button>
            <Radio.Button value="30min">30 min</Radio.Button>
            <Radio.Button value="1h">1 hour</Radio.Button>
            <Radio.Button value="3h">3 hours</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Mark as Read on Scroll:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setGeneral({ ...general, markAsReadOnScroll: e.target.value })}
            value={general.markAsReadOnScroll}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </div>

      </Card>

      <Card title="Appearance" style={{ marginBottom: "3rem",borderRadius:'20px' }}>
        <div style={{ marginBottom: 20, fontSize:18 }}>
          Font Size:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
            value={appearance.fontSize}
          >
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="medium">Medium</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Font Family:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setAppearance({ ...appearance, fontFamily: e.target.value })}
            value={appearance.fontFamily}
          >
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="arial">Arial</Radio.Button>
            <Radio.Button value="courier">Courier</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Theme:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
            value={appearance.theme}
          >
            <Radio.Button value="light">Light</Radio.Button>
            <Radio.Button value="dark">Dark</Radio.Button>
            <Radio.Button value="system">System Preference</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Display Density:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => setAppearance({ ...appearance, displayDensity: e.target.value })}
            value={appearance.displayDensity}
          >
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="compact">Compact</Radio.Button>
            <Radio.Button value="comfortable">Comfortable</Radio.Button>
          </Radio.Group>
        </div>
      </Card>

    </div>
  );
}

export default Settings;
