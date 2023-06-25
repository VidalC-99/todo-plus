<?php

namespace App\Controller;

use App\Entity\Todo;
use App\Repository\TodoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

class TodoController extends AbstractController
{
    #[Route('/api/todo', name: 'app_todo', methods:['GET'])]
    public function getTodo(TodoRepository $todosRepo): Response
    {
        return $this->json($todosRepo->findBy([], ['createdAt' => 'DESC']), 200, []);
    }

    #[Route('/api/todo/post', name: 'post_todo', methods:['POST'])]
    public function postTodo(TodoRepository $todoRepository, Request $request, SerializerInterface $serializer, EntityManagerInterface $em)
    {
        $jsonReceip = $request->getContent();
        try {
            $post = $serializer->deserialize($jsonReceip, Todo::class, 'json');
            $post->setCreatedAt(new \DateTimeImmutable);
            $em->persist($post);
            $em->flush();

            return $this->json($post, 200, []);
        } catch (\Throwable $th) {
            //throw $th;
        }

    }


    #[Route('/api/todo/delete/{id}', name: 'delete_todo', methods:['DELETE'])]
    public function deleteTodo(TodoRepository $todoRepository, int $id, Request $request, EntityManagerInterface $em, SerializerInterface $serializer)
    {
        $jsonReceip = $request->getContent();
        $post = $todoRepository->find($id);
        try {
            $em->remove($post);
            $em->flush();
            
            return $this->json($post, 200, []);
        } catch (\Throwable $th) {
            //throw $th;
        }
        //dd($jsonReceip);
        return $this->json($post);
    }

    #[Route('/api/todo/editDone/{id}', name:'edit_todo', methods:['PATCH'])]
    public function doneTodo(TodoRepository $todoRepository, EntityManagerInterface $em, int $id, Request $request, SerializerInterface $serialize)
    {
        try{

            $todoToUpdate = $todoRepository->find($id);
            $jsonReceipe = $request->getContent();
            $updateTodo = $serialize->deserialize($jsonReceipe, Todo::class, 'json');
            $todoToUpdate->setDone($updateTodo->isDone());
            //dd($post);
            $em->flush();
            return $this->json($todoToUpdate);
            
        }catch(\Throwable $th){
            throw $th;
        }

    }

    #[Route('/api/todo/editMode/{id}', name:'editMode_todo', methods:['PATCH'])]
    public function editMode(TodoRepository $todoRepository, EntityManagerInterface $em, int $id, Request $request, SerializerInterface $serialize)
    {
        try{

            $todoToUpdate = $todoRepository->find($id);
            $jsonReceipe = $request->getContent();
            $updateTodo = $serialize->deserialize($jsonReceipe, Todo::class, 'json');
            $todoToUpdate->setEdit($updateTodo->isEdit());
            //dd($post);
            $em->flush();
            return $this->json($todoToUpdate);
            
        }catch(\Throwable $th){
            throw $th;
        }

    }

    #[Route('/api/todo/editTitle/{id}', name:'editTitle_todo', methods:['PATCH'])]
    public function editTitle(TodoRepository $todoRepository, EntityManagerInterface $em, int $id, Request $request, SerializerInterface $serialize)
    {
        try{

            $todoToUpdate = $todoRepository->find($id);
            $jsonReceipe = $request->getContent();
            $updateTodo = $serialize->deserialize($jsonReceipe, Todo::class, 'json');
            $todoToUpdate->setTitle($updateTodo->getTitle());
            //dd($post);
            $em->flush();
            return $this->json($todoToUpdate);
            
        }catch(\Throwable $th){
            throw $th;
        }

    }

}
