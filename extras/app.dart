import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Healthy Recipe Book',
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Roboto',
      ),
      home: const RecipeListPage(),
    );
  }
}

class RecipeListPage extends StatelessWidget {
  const RecipeListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Healthy Recipe Book'),
      ),
      body: ListView(
        children: [
          RecipeCard(
            title: 'Quinoa Salad',
            description: 'A refreshing and nutritious salad with quinoa, vegetables, and a light dressing.',
            imageUrl: 'https://example.com/quinoa_salad.jpg',
          ),
          RecipeCard(
            title: 'Grilled Salmon',
            description: 'Omega-3 rich salmon fillet with a side of steamed vegetables.',
            imageUrl: 'https://example.com/grilled_salmon.jpg',
          ),
          RecipeCard(
            title: 'Avocado Toast',
            description: 'Whole grain toast topped with mashed avocado, cherry tomatoes, and a poached egg.',
            imageUrl: 'https://example.com/avocado_toast.jpg',
          ),
          RecipeCard(
            title: 'Greek Yogurt Parfait',
            description: 'Layers of Greek yogurt, fresh berries, and homemade granola.',
            imageUrl: 'https://example.com/yogurt_parfait.jpg',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implement add new recipe functionality
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class RecipeCard extends StatelessWidget {
  final String title;
  final String description;
  final String imageUrl;

  const RecipeCard({
    Key? key,
    required this.title,
    required this.description,
    required this.imageUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(10),
      elevation: 5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
            child: Image.network(
              imageUrl,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.headline6,
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyText2,
                ),
              ],
            ),
          ),
          ButtonBar(
            alignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: () {
                  // TODO: Implement view recipe details
                },
                child: const Text('View Recipe'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
