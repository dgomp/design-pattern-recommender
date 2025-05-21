import os
import shutil

def copy_build_files():
    # Caminhos
    frontend_build = os.path.join('frontend', 'build')
    static_dir = 'static'
    
    # Remove a pasta static existente
    if os.path.exists(static_dir):
        shutil.rmtree(static_dir)
    
    # Copia os arquivos do build para a pasta static
    shutil.copytree(frontend_build, static_dir)
    
    print("Arquivos compilados copiados com sucesso!")

if __name__ == '__main__':
    copy_build_files() 