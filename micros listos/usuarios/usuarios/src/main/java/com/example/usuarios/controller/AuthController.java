package com.example.usuarios.controller;

import com.example.usuarios.repository.UsuarioRepository;
import com.example.usuarios.model.Usuario;
import com.example.usuarios.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthService authService, UsuarioRepository usuarioRepository) {
        this.authService = authService;
        this.usuarioRepository = usuarioRepository;   // 🔥 INYECCIÓN AGREGADA
    }

    // =======================
    //      REGISTRO
    // =======================
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario registrado = authService.registrar(usuario);
            return ResponseEntity.ok(registrado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =======================
    //         LOGIN
    // =======================
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario usuario)
    {
        boolean ok = authService.login(usuario.getEmail(), usuario.getContrasena());
        if (ok) {
            return ResponseEntity.ok(Map.of("message", "Login exitoso.", "success", true));
        } else {
            return ResponseEntity.status(401).body(Map.of(
             "message", "Credenciales incorrectas.",
             "success", false));
        }
    }

    // =======================
    //    LISTAR TODOS
    // =======================
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(authService.listarUsuarios());
    }

    // =======================
    // BUSCAR POR CORREO 
    // =======================
    @GetMapping("/usuario/correo/{correo}")
    public ResponseEntity<?> buscarUsuarioPorCorreo(@PathVariable String correo) {

        Optional<Usuario> usuario = usuarioRepository.findByEmail(correo);

        if (usuario.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        return ResponseEntity.ok(usuario.get());
    }

    // =======================
    //    BUSCAR POR ID
    // =======================
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Usuario usuario = authService.buscarPorId(id);
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
        return ResponseEntity.ok(usuario);
    }
}
