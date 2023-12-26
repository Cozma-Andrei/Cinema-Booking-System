from cinema import Cinema
import random
x=Cinema("abc",123,12)

print('__Welcome to movie managment system_')
print('In order to add Drama Movies type:"add_drama"')
print('In order to add Animation Movies type:"add_animation"')
print('In order to display All Movies type:"display_all"')
print('In order to display Animation Movies type:"display_animations"')
print('In order to pick a random Movie type:"pick_random_movie"')
print('In order to save All Movies type:"save_all"')
print('In order to exit type:"exit"')

while True:
    val = input("Enter your choice: ")

    if val == "add_drama":
        T = input("Enter Movie name: ")
        D = input("enter duration of movie: ")
        A = input("Enter Age limit: ")
        x.add_drama_movie(T, D, A)


    elif val == "add_animation":
        T = input("Enter Movie name: ")
        D = input("enter duration of movie: ")
        L = input("Enter language: ")
        x.add_animation_movie(T, D, L)


    elif val == "display_all":
        x.mergeall()
        x.Displayall()


    elif val == "display_animations":
        x.display_animation_movie()


    elif val == "pick_random_movie":
        x.mergeall()
        x.pick_random_movie()


    elif val == "save_all":
        fname = input("Enter the Filename : ")
        x.mergeall()
        x.save_movies(fname)


    elif val == "exit":
        print('** ** ** ** ** ** ** *EXIT ** ** ** ** ** ** ** ** ** ** ')
        quit()
