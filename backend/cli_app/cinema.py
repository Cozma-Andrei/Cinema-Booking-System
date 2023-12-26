import random
from drama import Drama
from animation import Animation

class Cinema(Animation, Drama):
    def _init_(self, title, duration, agelimit,  voiceover):
        Drama.init(title, duration, agelimit)
        Animation.init(title, duration,  voiceover)

        self.movie_list = []

    def mergeall(self):
        self.movie_list = Drama.movie1 + Animation.movie2

    def Displayall(self):
        for Record in self.movie_list:
            print(Record)

    def pick_random_movie(self):
        if self.movie_list != 0:
            print("Your random picked movie is:", random.choice(self.movie_list))
        else:
            print("There are no movies to display.")

    def save_movies(self, fname):
        f = open(fname, 'w')
        for t in self.movie_list:
            f.write(str(t) + '\n')
        f.close()
