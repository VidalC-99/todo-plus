<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WebAppController extends AbstractController
{

    function __construct(private Security $security){
        $this->security = $security;
    }

    #[Route('/{ReactRouting}', name: 'home', defaults: ["reactRouting" => null])]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }
}
