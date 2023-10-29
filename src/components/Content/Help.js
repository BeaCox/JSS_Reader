import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

const Help = () => {
  return (
    <Collapse accordion>
      <Panel header="Account and login" key="1">
        <Collapse>
          <Panel header="How do I modify my account information?" key="11">
            Click the profile picture in the upper right corner - select 'Account' - click the corresponding button to modify.
          </Panel>
          <Panel header="What if I forget my password" key="12">
            Click Change Password on the Account page to change your new password, or log out of your account and register again.
          </Panel>
          <Panel header="Why can't I use JSS functionality on the Home page?" key="13">
            Please try to log in to your account normally.
          </Panel>
          <Panel header="Why registration failed?" key="14">
            Please check your input according to the error message.
          </Panel>
        </Collapse>
      </Panel>

      <Panel header="Subscribe features" key="2">
        <Collapse>
          <Panel header="Why aren't new subscriptions displayed?" key="21">
            Click the button next to the 'Feed' in the left sidebar - click 'Refresh Feeds' to refresh your subscriptions.
          </Panel>
          <Panel header="Why failed to add subscriptions?" key="22">
            Check that the url you entered is accessible or if the folder you added is selected.
          </Panel>
          <Panel header="How to star my own subscription?" key="23">
          Click the star icon in the bottom left corner of the subscription, and the subscription will be saved in the star column on the left side of the column. Click again to cancel.
          </Panel>
        </Collapse>
      </Panel>
      <Panel header="Settings and Personalization" key="3">
        <Collapse>
          <Panel header="How to reduce the brightness?" key="31">
            Try clicking the "Moon" button in the top right corner to switch to dark mode.
          </Panel>
          <Panel header="How to adjust subscription Settings and UI display?" key="32">
            Click the profile picture in the upper right corner - select 'Settings' - Personalize with the relevant options.
          </Panel>
        </Collapse>
      </Panel>
      <Panel header="Other possible problems" key="4">
        <Collapse>
          <Panel header="How can I get in touch with the author?" key="41">
            Scroll down to the bottom of the start page and click on the author's avatar to access their profile page.
          </Panel>
        </Collapse>
      </Panel>
    </Collapse>
  );
};

export default Help;