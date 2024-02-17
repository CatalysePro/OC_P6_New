
//? ************************************************************
//? * main.js ref V_19 *** index ref V9 *** style ref V10 ******
//? ************************************************************
//? * login.js ref V_8 *** login ref V7 *** login_style ref V7 *
//? ************************************************************
        
// WRAP ALL CODE WITH ANONYMUS FUNCTION WHICH ENSURE TREATMENT ONLY AFTER DOM LOADING

document.addEventListener('DOMContentLoaded', function() {

  // Retrieve token and logged in info
  let tokenId = localStorage.getItem('accessToken')
  console.log('Retrieved token');
  let userLoggedIn = localStorage.getItem('userLoggedIn')

  // Target the key elements with the html ID
  const logOutButton = document.querySelector('#login_link');
  const modifyGalleryBtn = document.querySelector('#modify-btn');
  // Check if elements are correctly selected
  console.log(logOutButton);
  console.log(modifyGalleryBtn);



  //TODO START MAIN FUNCTION : Managing website by Admin connexion status

  const checkLogIn = async () => {
    if (tokenId != null && userLoggedIn === 'true') {

        // Admin dedicated functions & privileges
        console.log('Admin is connected');
        console.log('Retrieved token');
        showAdminUI()
        console.log('Admin UI is active');
        logOut();
        console.log('Admin can log out by clicking the log out button');
        logOutButton.innerHTML = '<a href="index.html">logout</a>';

        //Admin Modal functions & other privileges
        openModalWindow();
        

        // For Admin : all public UI functions except ones related to filters buttons
        const works = await fetchWorks();   
        displayGallery(works);
        

    } else {
        userLoggedIn = false
        console.log('Admin is NOT connected - Public UI');
        hideAdminUI()
        console.log('Admin has to log in to access Admin UI');
        logOutButton.innerHTML = '<a href="login.html">login</a>';

        // All Public UI functions 
        const works = await fetchWorks(); 
        const category = await fetchCategories();
        console.log('verif works', works);

        createFilterButtons(category);
        displayGallery(works);
        
    }
  }

  //TODO END MAIN FUNCTION : Managing website by Admin connexion status

  // ========================= Start Admin functions

  // Admin interface display function
  function showAdminUI() {
    
    const headerAdminElement = document.getElementById("header-admin");
    headerAdminElement.style.display = "block";
    headerAdminElement.style.display = 'flex';
    headerAdminElement.style.justifyContent = 'center';
    headerAdminElement.style.alignItems = 'center';

    const loginLinkElement = document.getElementById("login_link");
    loginLinkElement.innerHTML = "logout";

    const publicHeaderElement = document.querySelector('header');
    publicHeaderElement.style.paddingTop = "50px";

    const filterButtonsElement = document.getElementById("filterButtons");
    filterButtonsElement.style.display = "none";

    const modifyBtnElement = document.getElementById("modify-btn");
    modifyBtnElement.style.display = "block";
    modifyBtnElement.style.display = 'flex';
    modifyBtnElement.style.justifyContent = 'center';
    modifyBtnElement.style.alignItems = 'center';

    console.log('Interface utilisateur modifiée pour l\'administrateur');
  }

  // Fonction Admin logout 
  function logOut() {
    console.log('logOut function called');
    
    // Behavior when logOut Btn is clicked
    if (logOutButton) {
        logOutButton.addEventListener('click', (event) => {
          
          event.preventDefault();
          console.log('Logout button clicked');

          // Remove the token and close Admin UI
          localStorage.removeItem('accessToken'); 
          console.log('Value of the token', tokenId);
        
          localStorage.removeItem('userLoggedIn');
          console.log('Admin connexion status', localStorage.getItem('userLoggedIn'));

          // Check if tokenId is still present
          if (tokenId) {
            console.log('Token is null or undefined');
            logOutButton.innerHTML = '<a href="login.html">login</a>';
            window.location.href = 'index.html';
          } else {
            logOutButton.innerHTML = '<a href="index.html">logout</a>';
            window.location.href = 'login.html';
          }

          // Call the function which will modify the behavior of the login/logout button
          hideAdminUI();

        });
    }
  }

  // Function which will occult the Admin UI
  function hideAdminUI() {
    const headerAdminElement = document.getElementById('header-admin');
    headerAdminElement.style.display = 'none';

    const loginLinkElement = document.getElementById("login_link");
    loginLinkElement.innerHTML = "login";

    const publicHeaderElement = document.querySelector('header');
    publicHeaderElement.style.paddingTop = "0px";

    const filterButtonsElement = document.getElementById("filterButtons");
    filterButtonsElement.style.display = "block";

    const modifyBtnElement = document.getElementById("modify-btn");
    modifyBtnElement.style.display = "none";

  }
 

  // §§§§§§§§ Start Modal functions & others privileges §§§§§§§

  
  // Function for a functionnal window (mini gallery with photo addition function & photo deletion function) 
  function openModalWindow() {
    console.log('Modal window function called');
    
    // Actions when #modify-btn is clicked
    if (modifyGalleryBtn) {
      modifyGalleryBtn.addEventListener('click', (event) => {

      event.preventDefault();
      console.log('Modify works button clicked');
      // make the background-cover appearing when the modal is opened
      backOverlay.style.display = 'block';

      // Call the necessary functions to make the mini gallery work
      fetchPhotos().then((miniPhotos) => {
        createMiniGallery(miniPhotos);
      });
      // other functions call here

      outsideCloseModalWindow();

      });
    }
  }        


  //* FUNCTION for retrieving photos from API to be used by the mini gallery (modal window) (no prior check of localStorage)

  async function fetchPhotos() {
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'GET', 
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de la requête vers l'API: ${response.status} ${response.statusText}`);
      }
  
      const miniPhotos = await response.json();
      console.log('Mini photos retrieved');
      return miniPhotos;
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      //! Error management here (message to the user for exemple)
      throw error; //! Propagate error to inform the rest of the code
    }
  }
  
  // Create a semi-transparent cover for the background when modal is opened
  const backOverlay = document.createElement('div');
  backOverlay.classList.add('back_overlay');

  // Append the cover to the body
  document.body.appendChild(backOverlay);

  
  //* FUNCTION to create the mini gallery with retrieved photos
  function createMiniGallery(miniPhotos) {
    console.log('Creating mini gallery');

  
    //* CREA & STYLE to make miniGalleryDiv a modal window (see also style.css)
    
    const miniGalleryDiv = document.createElement('div');
    miniGalleryDiv.classList.add('mini_gallery');

    // Create a title for the mini gallery 
    const galleryTitle = document.createElement('h2');
    galleryTitle.textContent = 'Galerie photo'; 

    // Create a container for the photos within the previous div & style
    const galleryBlocDiv = document.createElement('div');
    galleryBlocDiv.setAttribute('id','gallery-bloc');

    //todo Property addition to the object miniGalleryDiv for... 
    //todo... stocking the reference of galleryBlocDiv (to be used by deletion function)
    // miniGalleryDiv.galleryBlocDiv = galleryBlocDiv; //! maybe useless tbv


    // Create an element for the bottom border of the mini gallery-bloc and attachment to its parent
    const borderElement = document.createElement('div');
    borderElement.setAttribute('id','bottom-border-gallery-bloc');

    miniGalleryDiv.appendChild(borderElement);

      
    // Create a button for adding a photo
    const addPhotoBtn = document.createElement('button');
    addPhotoBtn.id = 'add-Photo-Btn'
    
    addPhotoBtn.textContent = 'Ajouter une photo'; 

    //* Function of the click of add a new project from the 1st modal to open the 2nd
    addPhotoBtn.addEventListener('click', (event) => {
      // stop event propagation to specify the clicked button and not the outside click
      event.stopPropagation();
      //todo Call of add photo function & actions
      miniGalleryDiv.style.display = ('none');
      addPhotoDiv.style.display = ('block');
      showAddPhotoModal();
      console.log('Add photo button clicked');
      // reconfirm back overlay
      backOverlay.style.display = 'block';
    });

    // Create a X button for closing the 2nd modal window (top right of the window)
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('fa-solid');
    closeBtn.classList.add('fa-xmark');
    closeBtn.setAttribute('id','close-btn'); // * Add an id for better css targetting

    //* Function of the click of X close button of the 2nd modal
    closeBtn.addEventListener('click', (event) => {

      // stop event propagation to specify the clicked button and not the outside click
      event.stopPropagation();
      
      // close the window by removing the elements
      document.body.removeChild(miniGalleryDiv);

      // erase the background cover
      backOverlay.style.display = 'none';
      console.log(' Closing Inside click done and dedicated actions called')
      
      // delete the outside click window closer eventListener
      document.removeEventListener('click', outsideCloseModalWindow);
    });

    
    //* FUNCTION to Iterate through the miniPhotos and create mini photo elements
    
    miniPhotos.forEach((photo) => {
      const photoContainer = document.createElement('div');
      photoContainer.setAttribute('id','bloc-photo'); //! Add an ID to the unitary photo container

      const miniPhoto = document.createElement('img');
      miniPhoto.src = photo.imageUrl;
      //todo More attributes or event listeners to be placed here-under as needed
      // miniPhoto.alt = photo.title || 'Mini Photo';

      // Create the trash icon for deletion
      const deleteIcon = document.createElement('div');
      deleteIcon.classList.add('fa-solid');
      deleteIcon.classList.add('fa-trash-can');
      deleteIcon.setAttribute('id','delete-icon'); // instead of the other method deleteIcon.id = 'delete-icon'
      

      // Append the mini photo and delete icon to the photo container
      photoContainer.appendChild(miniPhoto);
      photoContainer.appendChild(deleteIcon);

      // Append the photo container to the mini gallery
      galleryBlocDiv.appendChild(photoContainer);

      
      // Append the different elements to the mini gallery
      miniGalleryDiv.appendChild(galleryTitle);
      miniGalleryDiv.appendChild(galleryBlocDiv);
      miniGalleryDiv.appendChild(addPhotoBtn);
      miniGalleryDiv.appendChild(closeBtn);

      //todo Add dedicated eventListener to delete btns
      deleteIcon.addEventListener('click', async () => {
        // Declare the id associated to the work to be deleted
        const photoId = photo.id;
        // Deletion confirmation message
        const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');

        // If deletion confirmed
        if (confirmDelete) {
            // Function call for id and element
            await deletePhoto(photoId, photoContainer);
            // alert('Le projet a été supprimé définitivement.');
        } else {
            // If deletion canceled
            console.log('Suppression annulée');
        }
      });

    }); 
    //todo END loop forEach

    // Append the mini gallery to the document body or a specific container
    document.body.appendChild(miniGalleryDiv);

    //* Add an eventLsitener to handle modal window outside click
    document.addEventListener('click', (event) => {
      
      outsideCloseModalWindow(event, miniGalleryDiv);
      console.log('Outside click done and dedicated function called')
    
    });

    // values affection to global variables for further use
      addPhotoBtnGlobal = addPhotoBtn;
      miniGalleryDivGlobal = miniGalleryDiv;

  } 
  //! END createMiniGallery function

  //* FUNCTION Work deletion
  async function deletePhoto(id, photoContainer) {

    try {
        // Delete request via the API
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenId}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Check if deletion is ok
        if (response.ok) {
            console.log('Photo deleted successfully');

            // Retrieve the container to be deleted directly to the DOM... 
            //... via "parentNode" property for a better UX (no page reload for update)
            const galleryBlocDiv = photoContainer.parentNode;

            // Remove the photo container from the mini gallery
            galleryBlocDiv.removeChild(photoContainer);

            // other actions after deletion
            // Update main galery
            const updatedData = await fetchWorks();
            displayGallery(updatedData);
            // reconfirm back overlay
            backOverlay.style.display = 'block';

        } else {
            console.error('Failed to delete photo:', response.statusText);
            // actions in case of failure
        }
    } catch (error) {
        console.error('Error occurred while deleting photo:', error.message);
        // connexion errors management and other errors
    }
  } 
  //! end of deletion function
  
  //* MAIN FUNCTION ADD PHOTO 

  //* SET UP HTML for the main Container for Add Photo Modal

  const addPhotoDiv = document.createElement('div');
  addPhotoDiv.classList.add('div_add_photo');
  document.body.appendChild(addPhotoDiv);
  addPhotoDiv.style.display = 'none'; 

  //* SET UP HTML Elements for the addPhotoDiv (.div_add_photo)

  // AddPhotoDiv X close icon & function
  const closeIcon = document.createElement('div');
  closeIcon.classList.add('fa-solid');
  closeIcon.classList.add('fa-xmark');
  closeIcon.classList.add('close_icon_addPhotoDiv');

  closeIcon.id = ('close-icon-addPhotoDiv');
  // Attachment of the btn to the modal
  addPhotoDiv.appendChild(closeIcon);
  // NB : actions when btn clicked see line 817 (addNewWork function)

  // AddPhotoDiv get-back arrow & function
  const arrowIcon = document.createElement('div');
  arrowIcon.classList.add('fa-solid');
  arrowIcon.classList.add('fa-arrow-left');
  arrowIcon.classList.add('get_back_icon');
  arrowIcon.id = ('get-back-icon') 
  addPhotoDiv.appendChild(arrowIcon);

  //* Function of the click of the left arrow
  arrowIcon.addEventListener('click', (event) => {

    // stop event propagation to specify the clicked button and not another one
    event.stopPropagation();
    
    // close the window by removing the elements
    
    addPhotoDiv.style.display = 'none';
    miniGalleryDivGlobal.style.display = 'block';
    backOverlay.style.display = 'block';

    console.log('Get back to mini Gallery btn clicked')
    
    
    // delete the add new work form validation btn eventListener 
    document.removeEventListener('click', outsideCloseModalWindow);

  });

  // AddPhotoDiv title
  const addPhotoTitle = document.createElement('h2');
  addPhotoTitle.textContent = 'Ajout photo';
  addPhotoDiv.appendChild(addPhotoTitle);

  // AddPhotoDiv Form (sub container)
  const fieldPhotoForm = document.createElement('form');
  fieldPhotoForm.classList.add('field_photo_form');
  fieldPhotoForm.id = 'field-photo-form';
  fieldPhotoForm.action = '""';
  fieldPhotoForm.method = 'post';
  addPhotoDiv.appendChild(fieldPhotoForm);

  // AddPhotoDiv Form 1st field
  const fieldPhotoSubDiv = document.createElement('div');
  fieldPhotoSubDiv.classList.add('field_photo_subDiv'); // sub-sub-element

  fieldPhotoForm.appendChild(fieldPhotoSubDiv);
  

    // AddPhotoDiv Form 1st Field : Image Preview superposed on a container with 3 elements (image icon + btn +input field)
    const imageMiniature = document.createElement('img');
    imageMiniature.id = 'image-preview';
    imageMiniature.src = '#'; // Initial value
    fieldPhotoSubDiv.appendChild(imageMiniature);

    // Container for customized btn and hidden input type file
    const customFileInputContainer = document.createElement('div');
    customFileInputContainer.classList.add('custom_file_input_container');

    // Image icon crea 
    const iconImage = document.createElement('i');
    iconImage.classList.add('fa-regular');
    iconImage.classList.add('fa-image');
    iconImage.id = 'icon-image';
    // Attachment to the container
    customFileInputContainer.appendChild(iconImage);
    

    // Customized btn
    const customFileInputButton = document.createElement('label');
    customFileInputButton.textContent = '+ Ajouter un image';
    customFileInputButton.classList.add('custom_file_input_button');
    customFileInputButton.id = ('custom-file-input-button');
    customFileInputButton.setAttribute('for', 'file-photo-id');
    // Attach the btn to the container
    customFileInputContainer.appendChild(customFileInputButton);

    // Hidden input type file
    const fieldPhotoFile = document.createElement('input');
    fieldPhotoFile.type = 'file';
    fieldPhotoFile.id = 'file-photo-id';
    fieldPhotoFile.accept = 'image/png, image/jpeg; max-size=4MB';
    fieldPhotoFile.classList.add('real_file_input');
    // Attach the input to the container
    customFileInputContainer.appendChild(fieldPhotoFile);

    // Attach the container to the parent
    fieldPhotoSubDiv.appendChild(customFileInputContainer);

    // independant span for information about file to insert
    const fieldPhotoSpan = document.createElement('span');
    fieldPhotoSpan.classList.add('field_photo_span');
    fieldPhotoSpan.innerHTML = 'jpg. png : 4 Mo max';

    fieldPhotoSubDiv.appendChild(fieldPhotoSpan);

    // AddPhotoDiv Form Image Preview
    const imagePreview = document.createElement('img');
    imagePreview.id = 'image-preview';
    imagePreview.src = '#'; // Initial value
    fieldPhotoSubDiv.appendChild(imagePreview);

  // AddPhotoDiv Form 2nd field
  const fieldTitleLabel = document.createElement('label');
  fieldTitleLabel.classList.add('field_title_label');
  fieldTitleLabel.id = "label-title-id";
  fieldTitleLabel.htmlFor = 'photo-title-input-id';
  fieldTitleLabel.innerHTML = 'Titre';
  // Attach the field label to the form
  fieldPhotoForm.appendChild(fieldTitleLabel);

  const fieldTitleInput = document.createElement('input');
  fieldTitleInput.classList.add('field_photo_title_input');
  fieldTitleInput.type = 'text';
  fieldTitleInput.id = 'photo-title-input-id';
  // Attach the input field to the form
  fieldPhotoForm.appendChild(fieldTitleInput);

  // AddPhotoDiv Form 3rd field
  const fieldCategoryLabel = document.createElement('label');
  fieldCategoryLabel.classList.add('field_category_label');
  fieldCategoryLabel.id = "label-category-id";
  fieldCategoryLabel.htmlFor = 'photo-category-input-id';
  fieldCategoryLabel.innerHTML = 'Catégorie';
  // Attach the field label to the form
  fieldPhotoForm.appendChild(fieldCategoryLabel);

  // NB the input field is a menu with options based on numerical values (important for the post function)
  const fieldCategoryInput = document.createElement('select');
  fieldCategoryInput.classList.add('field_photo_category_input');
  fieldCategoryInput.id = 'photo-category-input-id';
  fieldCategoryInput.name = 'category'; 
  fieldCategoryInput.innerHTML = `
    <option value="blank"></option>
    <option value="1">Objets</option>
    <option value="2">Appartements</option>
    <option value="3">Hotels & restaurants</option>
  `;
  // Attach the input field to the form
  fieldPhotoForm.appendChild(fieldCategoryInput);

  // Create an element for the bottom border of the Add Photo form and attachment to its parent
  const bottomBorder2ndModal = document.createElement('div');
  bottomBorder2ndModal.setAttribute('id','bottom-border-addPhoto-form');

  fieldPhotoForm.appendChild(bottomBorder2ndModal);

  // AddPhotoDiv Form Validate Btn
  const validNewInsertBtn = document.createElement('button');
  validNewInsertBtn.classList.add('valid_new_insert_btn');
  validNewInsertBtn.id = 'valid-new-insert-btn-id';
  validNewInsertBtn.type = 'submit';
  validNewInsertBtn.innerHTML = 'Valider'; 
  // Attach the button to the form
  fieldPhotoForm.appendChild(validNewInsertBtn);


  //* BLOC for Form input clics management (stop propagation to avoid untimely modals closing and wrong console message)

  addPhotoDiv.addEventListener('click', (event) => { // necessary to cover all the modal area
    event.stopPropagation();

  });
  
  fieldTitleInput.addEventListener('click', (event) => {
    event.stopPropagation();
    
  });

  fieldCategoryInput.addEventListener('click', (event) => {
    event.stopPropagation();
    
  });

  //! END HTML SET UP for Add Photo Modal

  //* FUNCTION showing the modal for adding a new work 
  
  //todo recall of the global constant defined in the createMiniGallery function
  let addPhotoBtnGlobal;
  
  function showAddPhotoModal() {
    console.log('Modal AddPhoto appears & Main Modal disappears');

    // function call (validation btn changing color & activation)
      validationBtnBehave() 
      

    // Actions when addPhotoBtn is clicked
    if (addPhotoBtnGlobal) {
      addPhotoBtnGlobal.addEventListener('click', (event) => {

      event.preventDefault();

      
      // make the AddPhoto appearing and Main Modal disappearing
      miniGalleryDivGlobal.style.display = 'none';
      addPhotoDiv.style.display = 'block';
      // reconfirm back overlay
      backOverlay.style.display = 'block';

      // The call the necessary function(s) for adding new work is managed by actions on the form

      });
    }
    
  } 
  //! End ShowAddPhotoModal function
  

  //* FUNCTION uploading a local photo to the input field (fieldPhotoFile / #file-photo-id) + other data (properties values)

  //* BLOC Display Photo Preview - Event listener for file input change
  fieldPhotoFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('Aucun image sélectionné.');
      console.log('no file selected');
      return;
    } else {
      console.log('file selected');
    }

    // Display the selected image in a preview //todo possible to use disable property for the button
    const reader = new FileReader(); // JS generic method
    reader.onload = function(event) {
      console.log('Insert photo button clicked')
      const imagePreview = document.getElementById('image-preview'); 
      imagePreview.src = event.target.result;
      imagePreview.style.display = 'block'; // preview appearing
      customFileInputButton.style.color = '#e8f1f6'; // button vanishing
      customFileInputButton.style.backgroundColor = '#e8f1f6';
      customFileInputContainer.style.pointerEvents = 'none';
      iconImage.style.opacity = '0';
      fieldPhotoSpan.style.color = '#e8f1f6'; // span vanishing
    };
    
    reader.readAsDataURL(file);
  });

  // Target form submission
  const submitButton = document.getElementById('valid-new-insert-btn-id');

  //* BLOC Form fields completion error msgs - Event listener for form submission
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Value Retrieval of the file input
    const file = fieldPhotoFile.files[0];
    if (!file) {
      console.error('No img file selected.');
      alert("Veuillez insérer une image !");
      return;
    } else {
      console.log('Photo insert done'); 
    }

    // Retrieval of typed title to the object
    const title = fieldTitleInput.value;
    if (!title) {
      console.error('No tile typed');
      alert("Veuillez saisir un titre !");
      return;
    } else {
      console.log('Name typed'); 
    }

    
    // Retrieval of choosen category to the object
    const category = fieldCategoryInput.value;
    if (category === 'blank') {
      console.error('No category selected.');
      alert("Veuillez sélectionner une catégorie!");
      return;
    } else {
      console.log('Caterory choosen'); 
    }

    // Add new work (object) function call
    addNewWork();
  });

  //! END of uploading project from the form

  // check if validation btn is clickable (just for console)
  submitButton.addEventListener('click', function() {
    console.log('Validation button clicked');
  });

  
  //* Function in charge of validation btn changing color
  function validationBtnBehave() {
      const file = fieldPhotoFile.files[0];
      const title = fieldTitleInput.value;
      const category = fieldCategoryInput.value;

      // check if all fields are filled-in
      if (file && title.trim() !== '' && category.trim() !== 'blank') {
          // if yes change the color & activate the btn
          submitButton.style.backgroundColor = "#1D6154";
          submitButton.style.cursor = 'pointer';
          // submitButton.style.pointerEvents = 'auto';
          
      } else {
          // if not confirm the css default color and desactivate the btn
          submitButton.style.backgroundColor = "#a7a7a7";
          submitButton.style.cursor = 'not-allowed';
          // ... other styles
         //! desactivation after close click or submission is NOT due to this fucntion
      }
  }

  // Event listeners on all fields for checking completion
  fieldPhotoFile.addEventListener('change', () => {
      console.log('File just inserted');
      validationBtnBehave();
  });

  fieldTitleInput.addEventListener('input', () => {
      console.log('Title just typed');
      validationBtnBehave();
  });

  fieldCategoryInput.addEventListener('change', () => {
      console.log('Category just chosen');
      validationBtnBehave();
  });



  //* FUNCTION operating the New Work addition via the API (photo + title + category) from the form (AdPhotoDiv data)


  async function addNewWork() {

    try {
      const file = fieldPhotoFile.files[0];
      const title = fieldTitleInput.value;
      const category = fieldCategoryInput.value;

      // create a new object with form Data (JS generic method)
      const newProject = new FormData();

      newProject.append('image', file); 
      newProject.append('title', title);
      newProject.append('category', category);

      const tokenId = localStorage.getItem('accessToken');


      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenId}`,
          // 'Accept': 'application/json',
        },
        body : newProject
      });
  
      if (!response.ok) {
        throw new Error(`API request error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Work added with success:', data);
      alert('Le projet a été ajouté avec succès. Valider et cliquer sur la flèche ou fermer pour le voir dans la galerie.');
  
      // Call update functions
      // Update mini gallery
      const miniGalleryData = await fetchWorks();
      createMiniGallery(miniGalleryData);

      // Update main gallery
      const mainGalleryData = await fetchWorks();
      displayGallery(mainGalleryData);

      // call form fields emptying function
      cleanFormFieldsWhenDone();

      // // call the function for unfilled form fields (to be donde)
      // addWorkFieldsFormVerification(); //! useless

      // reconfirm back overlay
      backOverlay.style.display = 'block';

      // reconfirm AddPhoto Modal appearence //! do not work with distant repo - same for 1st modal with delete fonction
      addPhotoDiv.style.display = ('block');

  
    } catch (error) {
      console.error('Work addition Error:', error);
      // Inform user
      console.log('Une erreur s\'est produite lors de l\'ajout.');
    }
  }

  // ! End addNewWork function

  //* FUNCTION for closing the modal window by Inside click

  //todo recall of the global constant defined in the createMiniGallery function
  let miniGalleryDivGlobal;

  closeIcon.addEventListener('click', (event) => {

    // stop event propagation to specify the clicked button and not another one
    event.stopPropagation();
    
    // close the window by removing the elements
    
    addPhotoDiv.style.display = 'none';
    miniGalleryDivGlobal.style.display = 'none';

    // erase the background cover
    backOverlay.style.display = 'none';

    // call form fields emptying function
    cleanFormFieldsWhenDone();

    console.log('Add Photo window close btn clicked & form fields emptying')

    // delete the outside click window closer eventListener 
    document.removeEventListener('click', outsideCloseModalWindow);
    
    // delete the  add new work validation btn eventListener 
    document.removeEventListener('click', submitButton); //! useless

  });


  //* FUNCTION for closing the modal window by outside click
  function outsideCloseModalWindow(event, modal) {
    // check if the modal still exists before erasing it
    if (modal && document.body.contains(modal) && !modal.contains(event.target)) {
      document.body.removeChild(modal);
      
      // erase the background cover
      backOverlay.style.display = 'none';
      addPhotoDiv.style.display = 'none';

      // call form fields emptying function
    cleanFormFieldsWhenDone();

    console.log('Outside click : window(s) closing & form fields emptying')
  
      // Delete the eventListener
      document.removeEventListener('click', outsideCloseModalWindow);
    }
  }

  //* FUNCTION for emptying form fields after window(s) closing action

  function cleanFormFieldsWhenDone() {
    // Retrieve form
    const form = document.getElementById('field-photo-form');

    // Loop for running through form fields
    form.querySelectorAll('input, select').forEach(element => {
        // Reinitialization of each input field
        if (element.tagName === 'INPUT') {
            // New value for input field
            element.value = '';
        } else if (element.tagName === 'SELECT') {
            // New value for select field
            element.value = 'blank';
        }
    });

      customFileInputButton.style.color = '#306685'; // button appearing at its initial color
      customFileInputButton.style.backgroundColor = '#cbd6dc';
      customFileInputContainer.style.pointerEvents = 'auto';
      customFileInputButton.cursor = 'pointer';
      iconImage.style.opacity = '1';
      fieldPhotoSpan.style.color = '#444444'; // span appearing
      // preview disappearence
      const imagePreview = document.getElementById('image-preview');
      imagePreview.src = '';
      

    // function call (validation btn changing color & activation)
    validationBtnBehave()

  }
  //! End of emptying form fields function

  

  // §§§§§§§§ End Modal functions & others privileges §§§§§§§


  // ========================= End Admin functions


  // ^^^^^^^^^^^^^^^^^^^^^^^^^^ Start public UI & privileges

  // Function to fetch works data directly and only via the API (no prior check in locStor)
  async function fetchWorks() {
    let worksdata;

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Conversion into JSON format
      worksdata = await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
    }

    return worksdata;
  }


  // Function to fetch categories data directly and only via the API (no prior check in locStor)
  async function fetchCategories() {
    
      const response = await fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Conversion into JSON format
      const categoriesData = await response.json();

      return categoriesData;

     
  }
  
  

  // Function to create filter buttons for categories
  function createFilterButtons(categoriesData) {
    try {
      const filterButtonsContainer = document.getElementById('filterButtons');

      if (!categoriesData || !Array.isArray(categoriesData)) {
        throw new Error('Les catégories ne sont pas valides.');
      }

      // All categories button creation (active by default)
      const allButton = document.createElement('button');
      allButton.textContent = 'Tous';
      allButton.classList.add('active');
      allButton.addEventListener('click', () => {
        activateButton(allButton);
        displayFilteredList('all');
      });
      filterButtonsContainer.appendChild(allButton);

      // 1 filter button per category creation
      categoriesData.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => {
          activateButton(button);
          displayFilteredList(category.name);
        });
        filterButtonsContainer.appendChild(button);
      });
    } catch (error) {
      console.error('Erreur lors de la création des boutons de filtre pour les catégories:', error);
    }
  }


  // Function for activate the selected button and desativate others
  function activateButton(selectedButton) {
    const buttons = document.querySelectorAll('#filterButtons button');
    buttons.forEach(button => {
      button.classList.remove('active');
    });
    selectedButton.classList.add('active');
  }

  // Filtered works function using displayGallery function defined hereafter // to be optimized !!
  async function displayFilteredList(category) {
    try {
      const data = await fetchWorks();

      if (!data || !Array.isArray(data)) {
        console.error('Les données ne sont pas valides.');
        return;
      }

      const filteredData = category === 'all' ? data : data.filter(item => item.category.name === category);

      displayGallery(filteredData);
    } catch (error) {
      console.error('Erreur lors de l\'affichage des objets:', error);
    }
  }


  // Call function to display works (data) in the Gallery (displayGallery function... 
  //... mentionned in the filtered works displayFilteredList function )

  document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchWorks();
    displayGallery(data);
  });

  // Update (erase) the content the gallery container
  function displayGallery(data) {
    const galleryElement = document.getElementById('objectsContainer');
    galleryElement.innerHTML = ''; // erase the current content

    // Availability verification
    if (data && Array.isArray(data)) {
      // Cycle through elements in the data table
      data.forEach(item => {
        const imageElement = document.createElement('img');
        imageElement.src = item.imageUrl;
        imageElement.alt = item.title;

        const captionElement = document.createElement('p');
        captionElement.textContent = item.title;

        const containerElement = document.createElement('div');
        containerElement.classList.add('object');
        containerElement.appendChild(imageElement);
        containerElement.appendChild(captionElement);

        galleryElement.appendChild(containerElement);
      });
    } else {
      galleryElement.textContent = 'Aucune donnée disponible.';
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++

  // Main function call
  checkLogIn()

  // +++++++++++++++++++++++++++++++++++++++++++

}); // CLOSE GLOBAL WRAP DOM LOADING EVENT FUNCTION
