class movie():

    def _init_(self, title, duration):
        self.title = title
        self.duration = duration

    def display(self):
        print(self.title, self.duration)
