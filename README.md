# Thelotter TODOs Exam

## Getting Started

1. Install the project dependencies:
    1. in the project root: `npm i`
    2. `cd client` -> `npm i`
2. Run the project by running `npm run dev` from root

You should now have the development version running on your computer and accessible via <http://localhost:3000>

## Tasks

### Part 1 - TODO Item UI and Functionality

1a. We have a bug whenever an agent tries to see all of the TODO items there is an infinite loop of calling the server (check the network tab), it causes the same items to render, again and again, please fix it.

1b. there is an error in the console, "Warning: Each child in a list should have a unique "key" prop", fix that.

1c. Our TODO Item list is only showing the title and creation time. Make it show the content as well

1d. Our TODOs item list is not sorted by the status, our agents would like to be able to sort the items according to active/done status. add a sort option at the top of the screen with the text "order by status:" and a drop-down with 2 possible options "active", "done".

1e. Once an operation manager finished handling a TODO item, he would like to set it as Done. add a button per item to enable the operation manager the ability to update the item status. once the status changes, make sure you re-sort the list.

1f. It's important to handle all TODOs according to the due date, currently, items are not displayed according to it, add a button at the top of the screen 'Sort by date' with asc/desc option.

### Part 2 - Performance and Scale

2a. Every time the page reloads we get back all the items in the DB. this is not good in case there are many items, we would like to support paging and only get back partial results according to items per page (amount) and the page number. please add this functionality.

2b. going to the DB (fs) in order to get back the data for every request is costly. can you think of a way to reduce the DB roundtrips?

2c. some operations managers have an experty in a certain domain, which means they only can handle specific types of TODO. we would like to support a way for them to choose what types of TODO items they would like to see on the page.
add a filter option in the TODO item list on the client with possible options
"Results"
"Wins"
"Withdraw"
according to the selection generate a server call to get back only this type of item.

2d. (in accordance with 1d) Once an operation manager changed the TODO item status, we would like to persist the change in the DB, add the logic to the client and the server to support it.

#### 2e - Bonus Task

We got a request from the operation team to be able to find TODO items by a specific "key", for example, they would like to get all items that contain the key "awaiting", add this functionality.

**After we added this ability to search by keyword, our DB grows exponentially very soon, and how it takes very long to get the response from the server.**

Let's create a super search mechanism.

1. Add q query param `?fastSearch=` to the `/todos` API call and implement an *efficient* search solution, that gets a word as an input and returns an array of matching tickets.

2. Our code is not following the best practices rules, it is not well structured and not reusable. try and make it better.

3. Sometimes it takes time to load all the relevant TODOs, add Progress bar indication.

## General notes

- code should compile and run without any warnings.
- basic requirements must be met.
- consider best practices, edge cases, performance, and scale.
- the bonus is just a bonus, don't start with it.
Good luck!
