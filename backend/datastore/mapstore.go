package datastore

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type MapStore struct {
	data map[string]bool
}

func NewMapStore() *MapStore {
	newData := make(map[string]bool)

	return &MapStore{
		data: newData,
	}
}

func (ms *MapStore) GetCompleted(w http.ResponseWriter, r *http.Request) {
	completed := make(map[string]bool)
	for key, value := range ms.data {
		if value {
			completed[key] = value
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completed)
}

func (ms *MapStore) GetIncomplete(w http.ResponseWriter, r *http.Request) {
	incomplete := make(map[string]bool)
	for key, value := range ms.data {
		if !value {
			incomplete[key] = value
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(incomplete)
}

func (ms *MapStore) CreateTodo(w http.ResponseWriter, r *http.Request) {
	title := r.FormValue("title")

	ms.data[title] = false
}

func (ms *MapStore) UpdateTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	title := vars["title"]

	status, _ := strconv.ParseBool(r.FormValue("status"))

	for key := range ms.data {
		if key == title {
			ms.data[key] = status
		}
	}
}

func (ms *MapStore) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	title := vars["title"]

	delete(ms.data, title)
}
