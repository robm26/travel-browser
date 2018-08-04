### travel-browser
## Testing travel-browser

Now that your skill is setup, you can test it.
1. Say, "open travel browser" to issue a LaunchRequest.
1. Ask the skill to "browse cities".
1. Say "go to Chicago".

Stop here.  Check your Alexa app cards, and any Echo Show screens for lists and photos.

1. Open the skill again.
1. Say "my name is Danielle" or use your own name.
1. Listen for the skill to repeat the name it heard.  Confirm if correct.
1. Say "link session"
1. Listen for the three part pass phrase.
1. Open the page in your project: ```/web/user/www/userprofile.html```
1. Type in the pass phrase.
1. The user session API should authenticate and return the user record for editing.
1. Update fields in the user record such as name and namePronounce, and press save.
1. Start the skill again and listen.  You should hear the name you entered.
1. Review the IOT Browser tab.  You should be Connected (bottom left) and seeing live request/response messages appear as you use the skill.
1. Click the Recording tab.  Click the green Start Recording button.  Say a few words (loud) and press Stop Recording.
1. A preview of your recording, and a new button called "Save to Skill" appear.
1. Click "Save to Skill"
1. Click the Profile tab and re-load your session.  You should see that the audioClip field now has a unique MP3 filename set.
1. Start the skill again. You will hear the audio message played back to you.

As you test and build this page, open the browser's developer tools and watch the Console.
Log messages and errors will appear here.  The browser is running code from the folder ```/web/user/www/js/```

 * Start the [LAB](./LAB.md)
 * Go [Home](../../README.md)