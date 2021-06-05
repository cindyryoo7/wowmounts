# WoW, Mounts!

## Table of Contents

1. [Description](#Description)
2. [In Action](#In-Action)
2. [Background](#Background)
3. [Project Goals](#Project-Goals)
4. [User Features](#User-Features)
5. [Stack](#Stack)
6. [Challenges](#Challenges)
7. [Reflections](#Reflections)
8. [Future Goals](#Future-Goals)
9. [Setup](#Setup)

## Description
WoW, Mounts! is a fullstack, multi-page iOS application designed to track World of Warcraft (WoW) mounts. Main features include viewing over 700 unique mounts (e.g. mount name and description, faction requirements, etc.) in both a list and gallery view, searching for specific mounts by name, and adding mounts to a local collection that can be viewed later.

## In Action
|  |  |
:---------------:|:--------------:
Homescreen           |  List of Mounts
![homepage](assets/demo/homescreen.png?raw=true)  |  ![list](assets/demo/list.png?raw=true)
Search for a Mount           |  Detailed Mount Description
![search](assets/demo/search.png?raw=true)  |  ![description](assets/demo/description.png?raw=true)
Add to Collection           |  My Collection
![add](assets/demo/add.png?raw=true)  |  ![collection](assets/demo/collection.png?raw=true)
Gallery View           |  Authentication
![gallery](assets/demo/gallery.png?raw=true)  |  ![authentication](assets/demo/authentication.png?raw=true)

## Background
WoW, Mounts! was created as part of a two-day sprint challenge where I prioritized producing a Minimum Viable Product (MVP) using iterative, Agile best practices. I decided to choose this topic because I enjoy collecting WoW mounts in my freetime and wanted an easier, more intuitive way to track all of my mounts. This mobile application was created using the [Blizzard API](https://develop.battle.net/).

## Project Goals
### Main Goals
1. Learn React Native.
2. Create an MVP of a WoW mount tracker application.
### Stretch Goals
1. Use React Router to create multiple pages.
2. Integrate authentication to allow the user to login to their Blizzard account.
3. Deploy the app (AWS, Heroku, App Store, etc.).

## User Features
### Core Features
- Users should be able to see a list of mount names and click on one for more information.
- Users should be able to search for a specific mount by name.
- Users should be able to “add” or “remove” a mount to their collection and then view their collection later.
### Secondary Features
- Users should be able to see a gallery view of all mounts.
- Users should be able to navigate to multiple pages.
- Users should be able to login to their Blizzard account to access their account mounts.

## Stack
<table>
  <tr>
    <td>Languages</td>
    <td><img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
    <img alt="HTML5" src="https://img.shields.io/badge/html5%20-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/>
    <img alt="CSS3" src="https://img.shields.io/badge/css3%20-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/></td>
  </tr>
  <tr>
    <td>Frameworks & Libraries</td>
    <td><img alt="React" src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img alt="React Native" src="https://img.shields.io/badge/reactnative%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img alt="React Router" src="https://img.shields.io/badge/reactrouter%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img alt="NodeJS" src="https://img.shields.io/badge/Node.js%20-%2343853D.svg?logo=node.js&logoColor=white&style=for-the-badge"/>
    <img alt="Express.js" src="https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=for-the-badge"/>
    <img alt="MongoDB" src="https://img.shields.io/badge/mongodb%20-%2343853D.svg?logo=MongoDB&logoColor=white&style=for-the-badge"/>
    </td>
  </tr>
  <tr>
</table>

## Challenges
- The biggest challenge I anticipated for this project was learning React Native. This was my first time working with React Native and mobile apps, so I anticipated that learning this new JavaScript library would be a steep learning curve.
- I also anticipated that learning how to use the [Blizzard API](https://develop.battle.net/) would be a bit of a challenge. I had never worked with the Blizzard API, but I heard that the authorization process can get a little tricky.

## Reflections
- I really enjoyed making this mobile app. Not only did I enjoy the actual product I was working on, but learning React Native turned out to be not as difficult as I expected it to be. I found that there was a lot of overlap between React.js and React Native, such as reusable components and hooks. I also thought the React Native documentation was very easy to follow along because of its clear instructions and detailed examples, which I really appreciated as a first-time learner of React Native.
- I was a bit worried about learning how to develop a mobile app since it was my first time, but using the Expo CLI made it a lot easier. However, because I was using the Expo server to view my app on a iPhone simulator, I initally had a difficult time connecting my local server to the Expo server.
- I spent barely any time styling the application because I didn't want to waste time on design when I could have used the time to implement more functionality. However, I was pleasantly surprised that I was able to implement all the core user features and meet all of my goals (as well as some stretch goals) within the two-day sprint timeframe.
- One really cool feature that I got partway through implementing was external authentication to allow the user to login to their Blizzard account to see their mounts. Currently, clicking "Sign in to view my mounts" opens up the Safari application on the iPhone and directs the user to login to Blizzard, but pressing "Submit" does not yet redirect the user back to the mount tracker application.

## Future Goals
- Finish implementing external authentication to allow the user to login to their Blizzard account and view their mounts.
- Optimize for faster loading times.
- Add WoW-themed styling.

## Setup
1. Clone the repository:
```sh
git clone https://github.com/cindyryoo7/wowmounts.git
```
2. Navigate to the root directory of the repository:
```sh
cd wowmounts
```
3. Install dependencies:
```sh
npm install
```
4. Bundle and compile the frontend code:
```sh
expo start
```
5. View the client on the browser or iPhone simulator using Expo CLI.
