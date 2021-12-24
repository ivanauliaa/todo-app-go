package datastore

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/Xanvial/todo-app-go/model"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type DBStore struct {
	db *sql.DB
}

func NewDBStore() *DBStore {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		model.DBHost, model.DBPort, model.DBUser, model.DBPassword, model.DBName)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB Successfully connected!")

	return &DBStore{
		db: db,
	}
}

func (ds *DBStore) GetCompleted(w http.ResponseWriter, r *http.Request) {
	var completed []model.TodoData

	query := `
		SELECT id, title, status
		FROM todo
		WHERE status = true
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		log.Println("error on getting todo:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	defer rows.Close()

	for rows.Next() {
		var data model.TodoData
		if err := rows.Scan(&data.ID, &data.Title, &data.Status); err != nil {
			log.Println("error on getting todo:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}

		completed = append(completed, data)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completed)
}

func (ds *DBStore) GetIncomplete(w http.ResponseWriter, r *http.Request) {
	var incomplete []model.TodoData

	query := `
		SELECT id, title, status
		FROM todo
		WHERE status = false
	`

	rows, err := ds.db.Query(query)
	if err != nil {
		log.Println("error on getting todo:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	defer rows.Close()

	for rows.Next() {
		var data model.TodoData
		if err := rows.Scan(&data.ID, &data.Title, &data.Status); err != nil {
			log.Println("error on getting todo:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}

		incomplete = append(incomplete, data)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(incomplete)
}

func (ds *DBStore) CreateTodo(w http.ResponseWriter, r *http.Request) {
	title := r.FormValue("title")
	var id int

	// query := fmt.Sprintf("INSERT INTO todo (title, status) VALUES (%s, %t)", title, false)
	query := `
		INSERT INTO todo(title, status)
		VALUES($1, $2)
		RETURNING id
	`
	err := ds.db.QueryRow(query, title, false).Scan(&id)
	if err != nil {
		log.Println("error on creating todo:", err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "todo created",
		"id":      id,
	})
}

func (ds *DBStore) UpdateTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	status, _ := strconv.ParseBool(r.FormValue("status"))

	query := `
		UPDATE todo
		SET status = $1
		WHERE id = $2
	`
	err := ds.db.QueryRow(query, status, id)
	if err.Err() != nil {
		log.Println("error on updating todo:", err.Err())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "todo updated",
	})
}

func (ds *DBStore) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	query := `
		DELETE FROM todo
		WHERE id = $1
	`
	err := ds.db.QueryRow(query, id)
	if err.Err() != nil {
		log.Println("error on deleting todo:", err.Err())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "todo deleted",
	})
}
