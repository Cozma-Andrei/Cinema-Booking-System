from movie import movie
class Animation(movie):
    movie2 = []
    def __init__(self, title, duration, voiceover):
        self.title=title
        self.duration=duration

        self.voiceover=voiceover

    def add_animation_movie(self, title, duration, voiceover):
        self.movie2.append({
            'title': title,
            'duration': duration,
            'voiceover': voiceover,

        })

    def display_animation_movie(self):
        quantity = len(self.movie2)

        if quantity:
            print('You have following animation movies in collection:')
            for record in self.movie2:
                print(record)
            print(f'In total you have {quantity} {"animation movie" if quantity == 1 else "animation movies"}.')

        else:
             print('There are no movies in you collection.')

    def animation_movie_list(self):
        for record in self.movie2:
            print(record)


x=Animation("abc",123,"english")
