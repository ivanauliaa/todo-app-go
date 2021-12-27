# Workshop HIMIT PENS X TOKOPEDIA Submission

Overview:
- main branch -> first task which store data on backend session and use map data type
- db-base branch -> second task which store data on postgres db, use id as path params on update and delete endpoint

## How to Run This Project
Choose one of these ways (clone this project first, and change directory to it)
1. `go run backend/main.go`
2. `go build backend && ./backend`
3. `docker build --tag todo-app-go:mapstore . && docker run --name todo-app-go --publish 5000:5000 todo-app-go:mapstore`

Then you can access it on localhost:5000.

Or if you don't want to clone this project, you can follow steps below
1. `docker pull ivanauliaa/todo-app-go:mapstore`
2. `docker run --name todo-app-go --publish 5000:5000 ivanauliaa/todo-app-go:mapstore`

Then you can access it on localhost:5000.

Demo video:
[Link here](https://www.youtube.com/watch?v=_Dh9xcwYgSw&list=PLOSn51yTJNvX51xIg3VQ2pruXCHQGCiMG)

----

# todo-app-go

Make sure to run `go mod vendor` first to download all needed libraries

To run this application, call `make run` on root
To build only, call `make build` on root
Calling one of above will generate executable file in `bin/` folder, that can be used to start the application

After app binary is running, the web can be opened in http://localhost:8080/

```
bin                         # Binary output folder
backend
 ├── datastore              # Main datastore implementation code, add necessary implementation here
 |    └──  interface.go     # Contains interface struct with all function that needs to be implemented
 ├── webstatic              # Frontend Codes, taken from https://github.com/themaxsandelin/todo
 └── main.go                # Main program of the app
model
 └── model.go               # Data model of main object
```
