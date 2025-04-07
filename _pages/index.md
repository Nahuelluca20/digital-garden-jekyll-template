---
layout: page
title: Home
id: home
permalink: /
---

# Welcome, this is the place where I write what I learn! 🌱

This is the place where I share the knowledge I acquire, sometimes they are notes made in a simple way and sometimes they are more developed. But here you will be able to find everything I learn, this is my digital gardening.

<strong>Notes</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>
