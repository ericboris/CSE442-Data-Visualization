import matplotlib.pyplot as plt

fig, ax = plt.subplots()

twin1 = ax.twinx()

monthnum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
quantity = [87.14556327, 103.4451571, 115.0519429, 119.7364776, 122.8371959, 138.9554388, 131.1829388, 125.6169367, 111.3791878, 98.11474694, 86.32507959, 79.75434694]
sunshine = [889, 965, 1288, 1427, 1662, 1747, 1793, 1651, 1403, 1245, 936, 824]

p1, = ax.plot(monthnum, sunshine, "b-", label="Sunshine")
p2, = twin1.plot(monthnum, quantity, "r-", label="Quantity")

ax.set_xlim(0, 11)
ax.set_ylim(min(sunshine)-10, max(sunshine)+10)
twin1.set_ylim(min(quantity)-1, max(quantity)+1)

ax.set_xlabel("Month")
ax.set_ylabel("Sunshine")
twin1.set_ylabel("Quantity")

ax.yaxis.label.set_color(p1.get_color())
twin1.yaxis.label.set_color(p2.get_color())

tkw = dict(size=8, width=1.5)
ax.tick_params(axis='y', colors=p1.get_color(), **tkw)
twin1.tick_params(axis='y', colors=p2.get_color(), **tkw)
ax.tick_params(axis='x', **tkw)
ax.xaxis.xticks(monthnum, month, **tkx)

# ax.legend(handles=[p1, p2, p3])

plt.show()
