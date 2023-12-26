# TicketEase: proiect final (Cinema Booking System) - Informatica Aplicata 4
## Membrii echipei: Tudor Diana-Ioana si Cozma Andrei


### Scurta descriere a aplicatiei
#### Aplicatia este compusa din doua parti, una principala si anume website-ul de rezervare al biletelor de film, si una secundara, un mini-app pentru adaugare de filme si salvarea lor intr-un fisier din linia de comanda, de unde a aparut si ideea de a crea un website pentru rezervari la cinema.
#### Site-ul permite inregistrarea si autentificarea utilizatorilor (conturile cu pemisiuni de administrator au email-urile terminate in "@ticketease.com"), iar in czaul in care un utilizator nu este autentificat, atunci nu poate decat vizualiza ce filme sunt disponibile.
#### Site-ul permite rezervarea biletelor doar pentru urmatoarele 7 zile de dupa ziua curenta. Un utilizator poate face doar o rezervare (de maxim 5 locuri) per film, dintr-o sala de 72 de locuri, avand la dispoztie o "harta" a salii de cinema. De asemenea, poate vizualiza ce locuri a rezervat pentru fiecare film in parte. In plus, trebuie sa selecteze ziua pentru care vrea sa efectueze aceste operatiuni.
#### Un administrator are in plus drepturi de a sterge un film, de a adauga un film, sau de a efectua rezervari pentru alti utilizatori.

### Limbaje / tehnologii folosite:
* Frontend: HTML, CSS, JavaScript + React.js, React-Bootstrap
* Backend: Python/Flask
* Command-line interface app: Python
* Baza de date: MongoDB (+ MongoDBCompass pentru a vizualiza datele din baza de date, denumita "Cinema")

### Instructiuni rulare
* Se pot folosi comenzile din Makefile, calea curenta trebuind sa fie root-ul folderului aplicatiei (Cinema Booking System):
    * "make build" pentru instalarea dependintelor (trebuie instalat inainte npm - Node Package Manager si python3)
    * "make run_frontend" pentru pornirea frontend-ului
    * "make run_backend" pentru pornirea backend-ului
* In cazul in care comenzile din Makefile dau eroare, se ruleaza tot din root:
    * initiere frontend: cd frontend; npm install
    * initiere backend: cd backend; pip install -r requirements.txt
    * rulare frontend: cd frontend; npm start
    * rulare backend: cd backend; python3 app.py
* Pentru rularea "cli_app":
    * cd cli_app; python3 run.py
* Din cauza ca este blocat implicit mecanismul Cross-origin resource sharing (CORS) pe browser-ele moderne, a trebuit pentru a permite efectuarea request-urilor din frontend catre backend sa instalam o extensie de Microsoft Edge/Chrome care sa activeze CORS:
    * https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf

### Task-urile fiecarui membru al echipei:
* Tudor Diana-Ioana: partea de login si register, partea de administrare a filmelor si vizualizarea rezervarilor, aplicatia din CLI
* Cozma Andrei: partea de efectuare a rezervarilor, partea de administrare a filmelor si vizualizarea rezervarilor

### Probleme intampinate si solutii:
* Cea mai mare problema a fost reprezentata de problemele de legare dintre frontend si backend, care au fost rezolvate (sa speram) prin extensia care activeaza mecanismul CORS.
* O alta problema a fost reprezentata de dependintele pentru partea de backend:
    * nu am putut implementa alte feature-uri dorite (precum criptarea parolei inainte de a fi stocata in baza de date), din cauza erorilor la importarea diverselor module de Python.
    * am intampinat probleme la instalarea dependintelor salvate in fisierul "requirements.txt", care ar trebui sa fie rezolvate, deoarece dependintele problematice nu au mai fost folosite, si implicit le-am scos din fisier.

## Link-uri:
* Link GitHub: https://github.com/Cozma-Andrei/Cinema-Booking-System (privat pana la momentul prezentarii)
* Link demo YouTube: https://www.youtube.com/watch?v=Rzq71aEEaHg
