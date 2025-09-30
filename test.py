import matplotlib.pyplot as plt

# Define colors with labels for QuanFin Capital
colors = {
    "Emerald Green (#00A86B)": "#00A86B",
    "Deep Blue (#004080)": "#004080",
    "Teal (#008080)": "#008080",
    "Sky Blue (#00BFFF)": "#00BFFF",
    "Light Mint (#CFFFE5)": "#CFFFE5",
    "Dark Gray (#333333)": "#333333",
    "Light Gray (#F5F5F5)": "#F5F5F5",
}

# Plot the color palette
fig, ax = plt.subplots(figsize=(10, 3))
for i, (name, hex_code) in enumerate(colors.items()):
    ax.add_patch(plt.Rectangle((i, 0), 1, 1, color=hex_code))
    ax.text(i + 0.5, -0.2, name, ha='center', va='top', fontsize=9, rotation=45)

ax.set_xlim(0, len(colors))
ax.set_ylim(0, 1)
ax.axis("off")
plt.show()
