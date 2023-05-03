import turtle
t = turtle.Turtle()
for i in range(180):
  t.speed(0)
  t.color('#205295')
  t.circle(190 - i, 90)
  t.left(90)
  t.color('#0081C9')
  t.circle(190 - i, 90)
  t.left(18)