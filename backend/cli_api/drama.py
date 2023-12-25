from movie import movie
class Drama(movie):
    movie1 = []
    def __init__(self,title, duration, agelimit):
        self.title=title
        self.duration=duration
        self.agelimit=agelimit

    def add_drama_movie(self, title, duration, agelimit):
        self.movie1.append({
            'title': title,
            'duration': duration,
            'agelimit': agelimit,

        })

    def display_drama_movie(self):
        quantity = len(self.movie1)

        if quantity:
            print('You have following drama movies in collection:')
            for record in self.movie1:
                print(record)
            print(f'In total you have {quantity} {" drama movie" if quantity == 1 else " drama movies"}.')

        else:
             print('There are no movies in you collection.')

    def drama_movie_list(self):
        for record in self.movie1:
            print(record)

x=Drama("xyz",123,12)
