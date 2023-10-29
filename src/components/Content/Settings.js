import React, { useState , useEffect} from "react";
import { Card, Radio } from "antd";
import { useSettings } from "../../context/settingContext";

function Settings() {
  const { settings, updateSettings } = useSettings({});

  // 加载设置的状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (Object.keys(settings).length > 0) {
    setLoading(false);
  }
}, [settings]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSettingChange = (key, value) => {
    updateSettings(key, value);
  };

  return (
    <div style={{ padding: "2rem 3rem" }}>
      <Card title="General" style={{ marginBottom: "3rem",borderRadius:'20px' }}>
        <div style={{ marginBottom: 20, fontSize:18 }}>
          Start Page:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('start_page', e.target.value)}
            value={settings.start_page}
          >
            <Radio.Button value={1}>All</Radio.Button>
            <Radio.Button value={2}>Star</Radio.Button>
            <Radio.Button value={3}>Unread</Radio.Button>
            <Radio.Button value={4}>Explore</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Default Sort:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('default_sort', e.target.value)}
            value={settings.default_sort}
          >
            <Radio.Button value={1}>Latest</Radio.Button>
            <Radio.Button value={2}>Oldest</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Default Presentation:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('default_presentation', e.target.value)}
            value={settings.default_presentation}
          >
            <Radio.Button value={1}>Cards View</Radio.Button>
            <Radio.Button value={2}>Magazine View</Radio.Button>
            <Radio.Button value={3}>Titles-Only View</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Mark as Read on Scroll:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('mark_as_read_on_scroll', e.target.value)}
            value={settings.mark_as_read_on_scroll}
          >
            <Radio value={1}>Yes</Radio>
            <Radio value={2}>No</Radio>
          </Radio.Group>
        </div>

      </Card>

      <Card title="Appearance" style={{ marginBottom: "3rem",borderRadius:'20px' }}>
        <div style={{ marginBottom: 20, fontSize:18 }}>
          Font Size:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('font_size', e.target.value)}
            value={settings.font_size}
          >
            <Radio.Button value={1}>Small</Radio.Button>
            <Radio.Button value={2}>Medium</Radio.Button>
            <Radio.Button value={3}>Large</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Font Family:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('font_family', e.target.value)}
            value={settings.font_family}
          >
            <Radio.Button value={1}>Arial</Radio.Button>
            <Radio.Button value={2}>Courier</Radio.Button>
            <Radio.Button value={3}>Times New Roman</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Theme:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            value={settings.theme}
          >
            <Radio.Button value={1}>Light</Radio.Button>
            <Radio.Button value={2}>Dark</Radio.Button>
            <Radio.Button value={3}>System Preference</Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 20, fontSize:18 }}>
          Display Density:
          <Radio.Group
            style={{marginLeft:16}}
            onChange={(e) => handleSettingChange('display_density', e.target.value)}
            value={settings.display_density}
          >
            <Radio.Button value={1}>Default</Radio.Button>
            <Radio.Button value={2}>Compact</Radio.Button>
            <Radio.Button value={3}>Comfortable</Radio.Button>
          </Radio.Group>
        </div>
      </Card>

    </div>
  );
}

export default Settings;
